# BUSA Voting System - Deployment Guide

## Prerequisites
- GitHub account: https://github.com
- Vercel account (sign up with GitHub): https://vercel.com
- Railway account (sign up with GitHub): https://railway.app

---

## PART 1: GitHub Setup

### 1.1 Create GitHub Repository
1. Go to https://github.com/new
2. Create a repository named `busa-voting-system`
3. Choose **Public** (for easier deployment)
4. Add `.gitignore` for Node.js
5. Click "Create repository"

### 1.2 Push Your Code to GitHub
```powershell
# Navigate to your project folder
cd c:\Users\NAIGA\Desktop\BUSA

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: BUSA voting system"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/busa-voting-system.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## PART 2: Deploy Backend to Railway

### 2.1 Create Railway Project
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Authorize GitHub and select `busa-voting-system` repo
5. Choose `backend` folder as the root directory

### 2.2 Add PostgreSQL Database
1. In Railway dashboard, click "Add Service" → "Database" → "PostgreSQL"
2. Railway will auto-link the connection string

### 2.3 Set Environment Variables in Railway
1. Click on your backend service in Railway
2. Go to "Variables" tab
3. Add these variables:
   ```
   NODE_ENV=production
   JWT_SECRET=busa_voting_system_2026_secret_key
   FRONTEND_URL=https://your-vercel-domain.vercel.app
   PORT=5000
   ```
4. Save and deploy

### 2.4 Note Your Backend URL
- Railway will show you a public URL like: `https://busa-voting-system-production.up.railway.app`
- Save this URL for later

---

## PART 3: Migrate SQLite Database to PostgreSQL

### 3.1 Install PostgreSQL Driver
```powershell
cd backend
npm install pg
```

### 3.2 Create Database Migration Script
Create `backend/migrateDb.js`:
```javascript
const pg = require('pg');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const pgClient = new pg.Client(process.env.DATABASE_URL);
const sqliteDb = new sqlite3.Database('./database.sqlite');

async function migrate() {
  await pgClient.connect();
  
  // Create tables in PostgreSQL
  await pgClient.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      reg_no VARCHAR(50) UNIQUE,
      password VARCHAR(255),
      email VARCHAR(100),
      name VARCHAR(100),
      phone VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      admin_id VARCHAR(50) UNIQUE,
      password VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS guidelines (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255),
      content TEXT,
      category VARCHAR(100),
      is_published BOOLEAN DEFAULT false,
      created_by VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  console.log('Tables created successfully');
  await pgClient.end();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
```

---

## PART 4: Deploy Frontend to Vercel

### 4.1 Create Vercel Deployment
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your `busa-voting-system` GitHub repository
4. Select `frontend` as the root directory

### 4.2 Set Environment Variables in Vercel
1. In Vercel project settings, go to "Environment Variables"
2. Add:
   ```
   VITE_API_BASE_URL=https://your-railway-backend-url.up.railway.app/api
   ```
3. Click "Save"

### 4.3 Deploy
- Vercel will automatically deploy once you save
- Your site URL will be shown (e.g., `https://busa-voting-system.vercel.app`)

---

## PART 5: Update Backend CORS for Vercel Domain

In `backend/server.js`, update the CORS configuration:
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://your-vercel-domain.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## PART 6: Testing

### 6.1 Test Backend
```bash
curl https://your-railway-backend-url.up.railway.app/api/guidelines?published=true
```

### 6.2 Test Frontend
Visit: `https://your-vercel-domain.vercel.app`

---

## Troubleshooting

### Guidelines not showing on Vercel
- Check browser console (F12) for API errors
- Verify `VITE_API_BASE_URL` is set correctly in Vercel
- Ensure Railway backend is running

### CORS errors
- Update the `FRONTEND_URL` in Railway environment variables
- Restart the Railway deployment

### Database errors
- Verify `DATABASE_URL` is set in Railway
- Check that PostgreSQL service is running

---

## Final Deployment Checklist
- [ ] Code pushed to GitHub
- [ ] Backend deployed on Railway with PostgreSQL
- [ ] Frontend deployed on Vercel
- [ ] Environment variables set correctly
- [ ] CORS configured for both domains
- [ ] Testing on live URLs successful
