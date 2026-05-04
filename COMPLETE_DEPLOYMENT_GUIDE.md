# BUSA Voting System - Complete Deployment Guide (Fixed)

## 🔴 What Went Wrong

Your error shows: `npm error path /opt/render/project/src/package.json`

**Problem:** Render is looking for `package.json` in the wrong location. Your project structure is:
```
BUSA/
  ├── backend/
  │   └── package.json
  ├── frontend/
  │   └── package.json
  └── uploads/
```

But Render expected the root directory to contain `package.json` directly.

---

## ✅ Recommended Solution: Use Railway + Vercel (Easiest)

This avoids the Render configuration issues entirely.

---

## 📋 COMPLETE STEP-BY-STEP DEPLOYMENT GUIDE

### **PART 1: GitHub Setup (Already Done ✓)**
You've already pushed to GitHub! Check your repo at:
```
https://github.com/YOUR_USERNAME/busa-voting-system
```

---

### **PART 2: Deploy Backend to Railway**

#### 2.1 Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub (authorize it)
3. Dashboard opens automatically

#### 2.2 Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub"
3. Authorize GitHub access
4. Select `busa-voting-system` repository

#### 2.3 Configure Root Directory
1. A deployment dialog appears
2. **Important:** Click the three dots or "Settings"
3. Set "Root Directory" to `backend` (NOT `/backend`, just `backend`)
4. Click "Deploy"

#### 2.4 Wait for Initial Deploy
- Railway will build and deploy automatically
- Status shows "Building" → "Deploying" → "Success"
- Copy the public URL it generates (e.g., `https://busa-voting-backend-production.up.railway.app`)

#### 2.5 Add PostgreSQL Database
1. In the Railway dashboard, click "Add Service"
2. Select "Database" → "PostgreSQL"
3. Railway automatically connects it with `DATABASE_URL` environment variable

#### 2.6 Set Environment Variables
1. Click on your backend service in Railway
2. Go to "Variables" tab
3. Add these variables:

```
NODE_ENV=production
JWT_SECRET=busa_voting_system_2026_secret_key
PORT=5000
FRONTEND_URL=https://your-frontend-vercel-url.vercel.app
```

(You'll get the Vercel URL in Step 3, so come back to this)

4. Click "Save"
5. Railway auto-redeploys with new variables

---

### **PART 3: Deploy Frontend to Vercel**

#### 3.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub (authenticate)
3. Dashboard opens

#### 3.2 Import Your Project
1. Click "Add New" → "Project"
2. Select "Import Git Repository"
3. Paste your GitHub repo URL or select from list:
   ```
   busa-voting-system
   ```
4. Click "Import"

#### 3.3 Configure Build Settings
1. Framework Preset: Select "Vite" (or "Other" then set manually)
2. **Root Directory:** Set to `frontend`
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`
5. Click "Continue"

#### 3.4 Add Environment Variables
1. You should see "Environment Variables" section
2. Add this variable:
   ```
   VITE_API_BASE_URL=https://[YOUR-RAILWAY-BACKEND-URL]/api
   ```
   Replace `[YOUR-RAILWAY-BACKEND-URL]` with your actual Railway URL

3. Click "Deploy"

#### 3.5 Get Your Frontend URL
- Vercel shows deployment progress
- Once complete, copy the URL (e.g., `https://busa-voting-system.vercel.app`)

---

### **PART 4: Final Configuration**

#### 4.1 Update Railway Frontend URL
1. Go back to Railway dashboard
2. Click on backend service → Variables
3. Update `FRONTEND_URL` with your Vercel URL:
   ```
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
4. Save (Railway redeploys automatically)

#### 4.2 Verify Deployment
1. Visit your Vercel frontend URL
2. Try logging in with test credentials
3. Check if guidelines display correctly
4. Open DevTools (F12) → Network tab to verify API calls

---

## 🆘 If You're Still on Render (How to Fix)

If you need to use Render instead of Railway:

#### Fix: Redeploy with Correct Root Directory
1. Go to Render dashboard
2. Delete the failed deployment
3. Create a new Web Service
4. Connect GitHub repo
5. In settings, set:
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `npm start`
   - **Root Directory:** Leave blank (or set to `backend`)

**Better option:** Redeploy to Railway instead (it's simpler!)

---

## 🧪 Testing Your Deployment

### Test Backend API
```bash
curl https://your-railway-url.up.railway.app/api/guidelines?published=true
```
Should return JSON array of guidelines

### Test Frontend
Visit: `https://your-vercel-url.vercel.app`
- Homepage should load
- Guidelines page should display published guidelines
- Admin login should work

### Test Guidelines Flow
1. Log in as admin
2. Create a new guideline with "Publish" checked
3. Go to public guidelines page (refresh browser)
4. New guideline should appear

---

## ❌ Common Issues & Fixes

### Issue 1: "Cannot POST /api/admin/login"
**Cause:** Frontend can't reach backend
**Fix:** 
- Check `VITE_API_BASE_URL` is set correctly in Vercel
- Verify Railway backend is running (check Railway dashboard)
- Ensure you used full URL: `https://your-railway-url.up.railway.app/api`

### Issue 2: "CORS error" in browser console
**Cause:** Frontend and backend URLs don't match
**Fix:**
- Update `FRONTEND_URL` in Railway variables
- Restart Railway deployment
- Wait 30 seconds and refresh browser

### Issue 3: Guidelines not showing on frontend
**Cause:** Database not migrated or is_published not set
**Fix:**
- Edit a guideline in admin panel
- Check "Publish this guideline"
- Save and refresh public page

### Issue 4: Render deployment failed
**Cause:** Wrong root directory configured
**Fix:**
- Use Railway instead (much easier for this setup)
- Or redeploy to Render with root directory = `backend`

---

## 📚 Full Architecture

```
┌─────────────────────────────────────────────────┐
│        Frontend (React + Vite)                  │
│        Hosted on: Vercel                        │
│        URL: https://busa-voting-system.vercel.app │
└────────────┬────────────────────────────────────┘
             │
             │ API Calls to
             │ VITE_API_BASE_URL
             │
┌────────────▼────────────────────────────────────┐
│        Backend (Node.js + Express)              │
│        Hosted on: Railway                       │
│        URL: https://busa-backend-production.up.railway.app │
└────────────┬────────────────────────────────────┘
             │
             │ Database Connection
             │
┌────────────▼────────────────────────────────────┐
│        Database (PostgreSQL)                    │
│        Hosted on: Railway (same service)        │
│        Connection: DATABASE_URL env var         │
└─────────────────────────────────────────────────┘
```

---

## ✅ Final Checklist

- [ ] Code on GitHub
- [ ] Backend deployed on Railway with PostgreSQL
- [ ] Frontend deployed on Vercel  
- [ ] `VITE_API_BASE_URL` set in Vercel
- [ ] `FRONTEND_URL` set in Railway
- [ ] Both services show "Active" status
- [ ] Frontend loads without errors
- [ ] Backend API responds to requests
- [ ] Guidelines display on public page
- [ ] Admin can create and publish guidelines

---

## 📞 Need Help?

If something still doesn't work:
1. Check Railway dashboard for backend errors
2. Check Vercel deployment logs for frontend errors
3. Open DevTools (F12) in browser to see exact API errors
4. Share the error message for specific help

**Recommended:** Start fresh with Railway + Vercel (avoid Render issues entirely)
