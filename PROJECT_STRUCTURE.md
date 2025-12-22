# Project Structure Documentation

This document describes the reorganized project structure with separate `client/` and `server/` directories.

## Directory Structure

```
website/
├── client/                          # Frontend application
│   ├── app/                         # Next.js App Router
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Home page
│   │   ├── about/                  # About page
│   │   ├── login/                  # Login page
│   │   └── ...                     # Other pages
│   ├── pages/                       # Static HTML pages
│   │   ├── home-page-2.html
│   │   ├── login-page-2.html
│   │   └── ...                     # 48 HTML pages
│   ├── public/                      # Static files served by Next.js
│   │   ├── assets/                 # Frontend assets
│   │   │   ├── styles.css
│   │   │   ├── config.js
│   │   │   ├── js/                 # JavaScript modules
│   │   │   └── mock/               # Mock data
│   │   └── logo.jpeg               # Logo file
│   ├── assets/                      # Original assets (reference)
│   ├── frontend/                    # Design reference files
│   ├── next.config.js               # Next.js configuration
│   ├── tsconfig.json                # TypeScript configuration
│   ├── tailwind.config.js           # Tailwind CSS configuration
│   ├── postcss.config.js            # PostCSS configuration
│   ├── middleware.ts                # Next.js middleware
│   └── package.json                 # Frontend dependencies
│
├── server/                          # Backend API server
│   ├── routes/                      # Express routes
│   │   ├── auth.js                 # Authentication routes
│   │   ├── users.js                # User routes
│   │   ├── services.js             # Service routes
│   │   ├── bookings.js             # Booking routes
│   │   └── admin.js                # Admin routes
│   ├── middleware/                  # Express middleware
│   │   ├── auth.js                 # Authentication middleware
│   │   └── errorMonitoring.js      # Error monitoring
│   ├── models/                      # Database models (if using ORM)
│   ├── scripts/                     # Utility scripts
│   │   ├── migrate.js              # Database migrations
│   │   ├── seed.js                 # Database seeding
│   │   ├── fix-routes.js           # Route fixing utility
│   │   └── update-logo.js          # Logo update utility
│   ├── utils/                       # Utility functions
│   │   └── sanitize.js             # Input sanitization
│   ├── server.js                    # Express API server (port 3001)
│   ├── server-custom.js             # Custom Next.js server (if needed)
│   └── package.json                 # Backend dependencies
│
├── logs/                            # Application logs
│   ├── audit.log                   # Audit logs
│   └── auth.log                    # Auth logs
│
├── .env                             # Environment variables
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── package.json                     # Root workspace configuration
├── README.md                        # Main documentation
├── API_CONTRACT.md                  # API documentation
├── DEPLOYMENT.md                    # Deployment guide
└── PRODUCTION_CHECKLIST.md          # Production checklist
```

## File Organization

### Frontend Files (client/)

**Next.js Application:**
- `app/` - Next.js 14 App Router pages and layouts
- `pages/` - Static HTML pages (legacy)
- `public/` - Static assets served at root URL
- `middleware.ts` - Next.js middleware for routing

**Configuration:**
- `next.config.js` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration

**Dependencies:**
- React, Next.js, Tailwind CSS
- Frontend utilities (axios, lucide-react)

### Backend Files (server/)

**API Server:**
- `server.js` - Main Express API server (port 3001)
- `server-custom.js` - Custom server for serving Next.js (optional)

**Routes:**
- `routes/auth.js` - Authentication endpoints
- `routes/users.js` - User management
- `routes/services.js` - Service management
- `routes/bookings.js` - Booking management
- `routes/admin.js` - Admin endpoints

**Middleware:**
- `middleware/auth.js` - JWT authentication
- `middleware/errorMonitoring.js` - Error handling

**Utilities:**
- `scripts/migrate.js` - Database migrations
- `scripts/seed.js` - Database seeding
- `utils/sanitize.js` - Input sanitization

**Dependencies:**
- Express, PostgreSQL, JWT
- Security packages (helmet, cors, rate-limit)
- Validation (express-validator)

## Path References

### Server Paths
- Routes import middleware: `require('../middleware/auth')`
- Scripts reference server files: `path.join(__dirname, '..', 'server.js')`
- Logs directory: `path.join(__dirname, '..', 'logs')`

### Client Paths
- Next.js serves from `client/` directory
- Static files from `client/public/`
- Pages from `client/pages/`
- App router from `client/app/`

### Cross-References
- Server-custom.js serves client: `path.join(__dirname, '..', 'client')`
- API calls from client: `http://localhost:3001/api/`

## Environment Variables

All environment variables are in root `.env` file:
- `DATABASE_URL` - PostgreSQL connection
- `JWT_SECRET` - JWT signing secret
- `PORT` - Backend server port (default: 3001)
- `NEXT_PUBLIC_API_URL` - Frontend API URL

## Running the Application

### Development
```bash
# Run both
npm run dev

# Or separately
npm run dev:client  # Frontend on :3000
npm run dev:server  # Backend on :3001
```

### Production
```bash
npm run build
npm start
```

## Benefits of This Structure

1. **Separation of Concerns** - Clear distinction between frontend and backend
2. **Independent Deployment** - Can deploy client and server separately
3. **Team Collaboration** - Frontend and backend teams can work independently
4. **Dependency Management** - Separate package.json files for cleaner dependencies
5. **Scalability** - Easier to scale frontend and backend independently


