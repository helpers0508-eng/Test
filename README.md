# Helpers Platform

A full-stack service booking platform built with Next.js (frontend) and Express.js (backend).

## Project Structure

```
website/
├── client/                 # Frontend application
│   ├── app/               # Next.js app directory
│   ├── pages/             # HTML pages
│   ├── public/            # Static assets
│   ├── assets/            # Frontend assets
│   ├── next.config.js     # Next.js configuration
│   └── package.json       # Frontend dependencies
│
├── server/                # Backend API server
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── models/            # Database models
│   ├── scripts/           # Utility scripts (migrate, seed)
│   ├── utils/             # Utility functions
│   ├── server.js          # Express API server
│   └── package.json       # Backend dependencies
│
├── logs/                  # Application logs
├── .env                   # Environment variables (create from .env.example)
└── package.json           # Root workspace configuration
```

## Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 12.0
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd website
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```
   
   Or install separately:
   ```bash
   npm install              # Root dependencies
   cd client && npm install # Frontend dependencies
   cd ../server && npm install # Backend dependencies
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=3001
   FRONTEND_URL=http://localhost:3000
   
   # Database Configuration
   DATABASE_URL=postgresql://user:password@localhost:5432/helpers_db
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-min-32-chars
   
   # Email Configuration
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-specific-password
   
   # Next.js API URL
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. **Set up the database**
   ```bash
   npm run migrate
   npm run seed  # Optional: seed with sample data
   ```

## Development

### Run both frontend and backend
```bash
npm run dev
```

### Run separately

**Frontend only:**
```bash
npm run dev:client
# or
cd client && npm run dev
```

**Backend only:**
```bash
npm run dev:server
# or
cd server && npm run dev
```

### Available Scripts

**Root level:**
- `npm run dev` - Start both frontend and backend
- `npm run build` - Build both client and server
- `npm run start` - Start both in production mode
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database

**Client (frontend):**
- `npm run dev` - Start Next.js dev server (port 3000)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

**Server (backend):**
- `npm run dev` - Start Express API server with nodemon (port 3001)
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database

## Production Deployment

### Build
```bash
npm run build
```

### Start
```bash
npm start
```

Or start separately:
```bash
cd client && npm start  # Frontend on port 3000
cd ../server && npm start  # Backend on port 3001
```

## API Documentation

See [API_CONTRACT.md](./API_CONTRACT.md) for complete API documentation.

### Base URL
- Development: `http://localhost:3001`
- Production: `https://api.yourdomain.com`

### Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Project Architecture

### Frontend (Client)
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State Management**: React hooks
- **HTTP Client**: Axios

### Backend (Server)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Validation**: express-validator
- **Security**: Helmet, CORS, rate limiting

## Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Helmet.js security headers
- ✅ Input validation
- ✅ SQL injection protection
- ✅ Audit logging

## Troubleshooting

### Port conflicts
- Frontend default: 3000
- Backend default: 3001
- Change in `.env` or package.json scripts

### Database connection
- Verify `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Check database exists

### Module not found errors
- Run `npm run install:all` to install all dependencies
- Check you're in the correct directory when running commands

## License

MIT

## Support

For issues and questions, please open an issue on GitHub or contact the development team.
