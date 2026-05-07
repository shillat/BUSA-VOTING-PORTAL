# Email Setup Guide for BUSA Voting System

## Problem
Remote in-service students are not receiving emails for:
1. Registration pending notification
2. Registration approval/rejection

## Solution: Configure Gmail SMTP

### Step 1: Create a Gmail App Password
1. Go to your Google Account: https://myaccount.google.com/
2. Enable 2-Step Authentication if not already enabled
3. Go to Security → 2-Step Verification → App passwords
4. Generate a new app password:
   - Select "Mail" for the app
   - Select "Other (Custom name)" and enter "BUSA Voting System"
   - Copy the 16-character password

### Step 2: Create .env file
Create a `.env` file in the `backend/` directory with:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=your_postgresql_url_here
JWT_SECRET=busa_voting_system_2026_secret_key
FRONTEND_URL=http://localhost:3000
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=your-16-character-app-password
```

### Step 3: Restart the Server
After creating the .env file, restart your backend server for the changes to take effect.

## Testing Email Configuration
To test if emails are working:
1. Register a remote in-service student with a real email address
2. Check the server console for email logs
3. Check your email inbox (and spam folder)

## Common Issues
- **"Invalid login"**: Make sure you're using an App Password, not your regular Gmail password
- **"Connection refused"**: Check if your firewall is blocking SMTP connections
- **Emails in spam**: Check spam folder and mark as "Not spam"

## Production Deployment
For production (Vercel, Railway, etc.):
1. Set the same environment variables in your hosting platform
2. Use a production email service like SendGrid or AWS SES for better deliverability
3. Configure proper SPF/DKIM records for your domain

## Current Email Flow
The system sends emails for:
- ✅ Pending registration (remote in-service students)
- ✅ Registration approval (all students)
- ✅ Registration rejection (all students)
- ✅ Regular student immediate approval

All email functions are properly implemented - they just need proper SMTP configuration.
