# MongoDB Atlas IP Whitelist Setup

## Issue
Your backend server cannot connect to MongoDB Atlas because your IP address is not whitelisted.

## Quick Fix (5 minutes)

### Step 1: Go to MongoDB Atlas
1. Open https://cloud.mongodb.com/
2. Sign in with your credentials

### Step 2: Navigate to Network Access
1. In the left sidebar, click on **"Network Access"** (under Security section)
2. You'll see a list of whitelisted IP addresses

### Step 3: Add Your IP Address

**Option A: Add Current IP (Recommended for Development)**
1. Click the **"Add IP Address"** button
2. Click **"Add Current IP Address"**
3. MongoDB will auto-detect your current IP
4. Click **"Confirm"**

**Option B: Allow Access from Anywhere (For Testing Only - Less Secure)**
1. Click the **"Add IP Address"** button
2. Click **"Allow Access from Anywhere"**
3. This adds `0.0.0.0/0` to the whitelist
4. Click **"Confirm"**
5. ⚠️ **Warning**: This is less secure, only use for testing

### Step 4: Wait for Changes to Apply
- Wait 1-2 minutes for the changes to propagate
- Your backend server will automatically reconnect (nodemon is watching)

### Step 5: Verify Connection
Once your IP is whitelisted, you should see in your backend terminal:
```
✅ MongoDB Connected: cluster0-shard-00-00.ko7quug.mongodb.net
📊 Database: test
```

## Troubleshooting

### If connection still fails:
1. **Check your connection string** in `backend/.env`:
   - Make sure `MONGODB_URI` is correct
   - Verify username and password are correct
   - No special characters that need URL encoding

2. **Restart backend server manually**:
   ```bash
   cd backend
   npm run dev
   ```

3. **Test connection directly**:
   ```bash
   cd backend
   node test-atlas-connection.js
   ```

## Current Status
- ✅ Backend code is ready
- ✅ Environment variables configured
- ✅ Duplicate index warning fixed
- ⏳ Waiting for IP whitelist configuration

## After IP Whitelist is Added
Your signup page will work automatically because:
- Backend API will be running on http://localhost:5000
- Frontend can make requests to `/api/auth/register`
- User data will be saved to MongoDB Atlas
- Welcome email will be sent (if email is configured)
