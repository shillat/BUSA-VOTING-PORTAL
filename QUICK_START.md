# BUSA Voting System - Quick Start Deployment

## 🚀 Quick 5-Step Deployment

### Step 1: Prepare Your Code (5 minutes)
```powershell
# Make sure your backend is restarted with latest changes
cd c:\Users\NAIGA\Desktop\BUSA\backend
npm install  # Install any missing dependencies
```

### Step 2: Push Code to GitHub (5 minutes)
```powershell
cd c:\Users\NAIGA\Desktop\BUSA

# Run the quick deployment script (Windows only)
.\push-to-github.bat

# OR manually:
git init
git add .
git commit -m "Initial commit: BUSA voting system"
git remote add origin https://github.com/YOUR_USERNAME/busa-voting-system.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy Backend to Railway (10 minutes)
1. Visit https://railway.app
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub"
4. Select your `busa-voting-system` repository
5. **Important:** In the settings, set the root directory to `/backend`
6. Click "Add Service" → "PostgreSQL"
7. Go to Variables tab and add:
   ```
   NODE_ENV=production
   JWT_SECRET=busa_voting_system_2026_secret_key
   PORT=5000
   ```
8. Copy your Railway backend URL (looks like `https://busa-voting-system-production.up.railway.app`)
9. **SAVE THIS URL** - you'll need it for the frontend

### Step 4: Deploy Frontend to Vercel (10 minutes)
1. Visit https://vercel.com/dashboard
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Select your `busa-voting-system` repository
5. **Important:** Set "Root Directory" to `/frontend`
6. Add Environment Variable:
   ```
   VITE_API_BASE_URL=https://[YOUR-RAILWAY-URL]/api
   ```
   (Replace `[YOUR-RAILWAY-URL]` with the URL from Step 3)
7. Click "Deploy"
8. Your site is live! Vercel will show you the URL

### Step 5: Test Everything
- Visit your Vercel URL
- Try logging in as admin (or registering as voter)
- Try creating/publishing a guideline
- Check if it appears on the public guidelines page

---

## ⚠️ Important Notes

### Database Migration (If you have existing data)
If you have existing data in SQLite that you want to keep:
1. Extract data from your local database
2. Insert into PostgreSQL on Railway
3. Or restart fresh with empty PostgreSQL

### Environment Variables Reference
**Frontend (Vercel):**
```
VITE_API_BASE_URL=https://your-railway-backend.up.railway.app/api
```

**Backend (Railway):**
```
NODE_ENV=production
JWT_SECRET=busa_voting_system_2026_secret_key
PORT=5000
FRONTEND_URL=https://your-vercel-domain.vercel.app
```

### Troubleshooting Common Issues

**Q: Guidelines not showing on Vercel**
- Check Network tab in DevTools (F12)
- Verify `VITE_API_BASE_URL` is set in Vercel
- Ensure Railway backend is running (check Railway dashboard)

**Q: "Cannot POST /api/admin/login"**
- Railway backend might not be deployed yet
- Check that root directory is set to `/backend` in Railway

**Q: CORS errors in browser**
- The frontend and backend URLs don't match
- Check `FRONTEND_URL` in Railway settings
- Check `VITE_API_BASE_URL` in Vercel settings

---

## 📋 Deployment Checklist
- [ ] Code pushed to GitHub
- [ ] Railway account created
- [ ] Vercel account created
- [ ] Backend deployed on Railway with PostgreSQL
- [ ] Frontend deployed on Vercel
- [ ] Environment variables configured
- [ ] Testing on live URLs successful

---

## 🔗 Useful Links
- GitHub: https://github.com
- Railway: https://railway.app
- Vercel: https://vercel.com
- Full guide: See `DEPLOYMENT_GUIDE.md`
