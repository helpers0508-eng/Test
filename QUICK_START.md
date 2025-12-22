# Quick Start Guide

After reorganization, follow these steps to get started:

## 1. Install Dependencies

```bash
npm run install:all
```

This installs:
- Root workspace dependencies
- Client (frontend) dependencies
- Server (backend) dependencies

## 2. Set Up Environment

Create `.env` file in the root directory:

```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/helpers_db
JWT_SECRET=your-super-secret-jwt-key-change-this-min-32-chars
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 3. Set Up Database

```bash
npm run migrate
npm run seed  # Optional
```

## 4. Start Development

### Option 1: Run Both Together
```bash
npm run dev
```

### Option 2: Run Separately

**Terminal 1 - Frontend:**
```bash
npm run dev:client
# or
cd client && npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run dev:server
# or
cd server && npm run dev
```

## 5. Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Health: http://localhost:3001/api/health

## Directory Structure

```
website/
├── client/          # Frontend - Next.js app
│   ├── app/        # Next.js pages
│   ├── pages/      # HTML pages
│   └── public/     # Static files
│
├── server/          # Backend - Express API
│   ├── routes/     # API endpoints
│   ├── middleware/ # Express middleware
│   └── scripts/    # Utilities
│
└── .env            # Environment variables
```

## Common Commands

```bash
# Development
npm run dev              # Both frontend & backend
npm run dev:client       # Frontend only
npm run dev:server       # Backend only

# Production
npm run build            # Build both
npm start                # Start both

# Database
npm run migrate          # Run migrations
npm run seed             # Seed database

# Testing
npm test                 # Run tests
```

## Troubleshooting

### Port Already in Use
- Frontend: Change port in `client/package.json` or use `PORT=3001 npm run dev`
- Backend: Change `PORT` in `.env` file

### Module Not Found
```bash
# Reinstall dependencies
npm run install:all
```

### Database Connection Error
- Check PostgreSQL is running
- Verify `DATABASE_URL` in `.env`
- Ensure database exists

## Next Steps

1. ✅ Install dependencies: `npm run install:all`
2. ✅ Set up `.env` file
3. ✅ Run migrations: `npm run migrate`
4. ✅ Start development: `npm run dev`
5. ✅ Open http://localhost:3000

For more details, see [README.md](./README.md) and [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md).


