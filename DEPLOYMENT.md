# Production Deployment Guide

This guide covers deploying the Helpers platform to production.

## Pre-Deployment Checklist

### 1. Environment Variables

Ensure all required environment variables are set:

```bash
# Required
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=<strong-secret-min-32-chars>
FRONTEND_URL=https://yourdomain.com

# Recommended
ENABLE_AUDIT_LOGS=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_WINDOW_MS=300000
AUTH_RATE_LIMIT_MAX_REQUESTS=5

# Optional
EMAIL_USER=your-email@domain.com
EMAIL_PASS=your-password
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### 2. Database Setup

1. **Create production database:**
   ```bash
   createdb helpers_production
   ```

2. **Run migrations:**
   ```bash
   NODE_ENV=production npm run migrate
   ```

3. **Set up database backups:**
   - Configure automated daily backups
   - Test restore procedures
   - Set up replication if needed

### 3. Security Hardening

- [ ] Change all default passwords
- [ ] Use strong JWT_SECRET (32+ characters, random)
- [ ] Enable SSL/TLS for database connections
- [ ] Configure firewall rules
- [ ] Set up rate limiting appropriately
- [ ] Enable audit logging
- [ ] Review CORS settings
- [ ] Set up security headers (Helmet is already configured)

### 4. Build and Test

```bash
# Install dependencies
npm ci --only=production

# Build Next.js application
npm run build

# Test the build
npm start
```

## Deployment Options

### Option 1: Traditional Server (VPS/Cloud)

#### Using PM2 (Recommended)

1. **Install PM2:**
   ```bash
   npm install -g pm2
   ```

2. **Create ecosystem file (`ecosystem.config.js`):**
   ```javascript
   module.exports = {
     apps: [{
       name: 'helpers-api',
       script: './server.js',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production',
         PORT: 3001
       },
       error_file: './logs/pm2-error.log',
       out_file: './logs/pm2-out.log',
       log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
       merge_logs: true,
       autorestart: true,
       max_memory_restart: '1G'
     }, {
       name: 'helpers-frontend',
       script: 'npm',
       args: 'start',
       instances: 1,
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       }
     }]
   };
   ```

3. **Start with PM2:**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

#### Using systemd

Create `/etc/systemd/system/helpers.service`:

```ini
[Unit]
Description=Helpers Platform API
After=network.target postgresql.service

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/website
Environment=NODE_ENV=production
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### Option 2: Docker

1. **Create Dockerfile:**
   ```dockerfile
   FROM node:18-alpine AS builder
   
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build
   
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY --from=builder /app/.next ./.next
   COPY --from=builder /app/server.js ./
   COPY --from=builder /app/routes ./routes
   COPY --from=builder /app/middleware ./middleware
   COPY --from=builder /app/scripts ./scripts
   
   EXPOSE 3000 3001
   CMD ["node", "server.js"]
   ```

2. **Create docker-compose.yml:**
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
         - "3001:3001"
       environment:
         - NODE_ENV=production
         - DATABASE_URL=${DATABASE_URL}
         - JWT_SECRET=${JWT_SECRET}
       depends_on:
         - db
     
     db:
       image: postgres:15-alpine
       environment:
         - POSTGRES_DB=helpers_db
         - POSTGRES_USER=helpers
         - POSTGRES_PASSWORD=${DB_PASSWORD}
       volumes:
         - postgres_data:/var/lib/postgresql/data
   
   volumes:
     postgres_data:
   ```

3. **Deploy:**
   ```bash
   docker-compose up -d
   ```

### Option 3: Platform as a Service (PaaS)

#### Heroku

1. **Create Procfile:**
   ```
   web: node server.js
   ```

2. **Deploy:**
   ```bash
   heroku create your-app-name
   heroku config:set NODE_ENV=production
   heroku config:set DATABASE_URL=...
   heroku config:set JWT_SECRET=...
   git push heroku main
   ```

#### Railway / Render / Vercel

Follow platform-specific deployment guides. Ensure:
- Environment variables are set
- Database is provisioned
- Build command: `npm run build`
- Start command: `npm start`

## Reverse Proxy Setup (Nginx)

Example Nginx configuration:

```nginx
upstream api {
    server localhost:3001;
}

upstream frontend {
    server localhost:3000;
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # API endpoints
    location /api {
        proxy_pass http://api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Monitoring and Maintenance

### Health Checks

Monitor the health endpoint:
```bash
curl https://yourdomain.com/api/health
```

### Log Management

- Set up log rotation
- Configure centralized logging (e.g., ELK stack, CloudWatch)
- Monitor error rates
- Set up alerts for critical errors

### Performance Monitoring

- Monitor response times
- Track database query performance
- Set up APM (Application Performance Monitoring)
- Monitor memory and CPU usage

### Backup Strategy

1. **Database backups:**
   - Daily automated backups
   - Weekly full backups
   - Monthly archive backups

2. **Application backups:**
   - Version control (Git)
   - Configuration backups
   - Environment variable backups (secure storage)

## Troubleshooting

### Common Issues

1. **Database connection errors:**
   - Check DATABASE_URL format
   - Verify network connectivity
   - Check firewall rules
   - Verify database credentials

2. **JWT authentication failures:**
   - Verify JWT_SECRET is set correctly
   - Check token expiration
   - Verify token format

3. **CORS errors:**
   - Verify FRONTEND_URL matches actual domain
   - Check CORS configuration in server.js

4. **Performance issues:**
   - Check database query performance
   - Review rate limiting settings
   - Monitor memory usage
   - Check for memory leaks

## Rollback Procedure

1. **Stop current deployment:**
   ```bash
   pm2 stop all
   # or
   docker-compose down
   ```

2. **Restore previous version:**
   ```bash
   git checkout <previous-commit>
   npm ci
   npm run build
   ```

3. **Restart services:**
   ```bash
   pm2 restart all
   # or
   docker-compose up -d
   ```

## Security Updates

- Keep dependencies updated: `npm audit`
- Review security advisories regularly
- Update Node.js version when needed
- Apply security patches promptly


