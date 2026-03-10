# Fix MongoDB Atlas Connection - Step by Step

## Your Current IP Address: 61.3.6.147

## The Problem
Your backend server cannot connect to MongoDB Atlas because your IP address (61.3.6.147) is not whitelisted.

## The Solution (Takes 2 minutes)

### Step 1: Open MongoDB Atlas
1. Go to: **https://cloud.mongodb.com/**
2. Sign in with your credentials

### Step 2: Navigate to Network Access
1. Look at the left sidebar
2. Find the **"Security"** section
3. Click on **"Network Access"**

### Step 3: Add Your IP Address

**OPTION A - Add Your Specific IP (Recommended)**
1. Click the green **"ADD IP ADDRESS"** button (top right)
2. A dialog will appear
3. Click **"ADD CURRENT IP ADDRESS"**
4. It should show: `61.3.6.147`
5. Add a comment (optional): "Development Machine"
6. Click **"Confirm"**

**OPTION B - Allow All IPs (For Testing Only)**
1. Click the green **"ADD IP ADDRESS"** button
2. Click **"ALLOW ACCESS FROM ANYWHERE"**
3. It will add: `0.0.0.0/0`
4. Click **"Confirm"**
5. ⚠️ **Warning**: Less secure, only for testing

### Step 4: Wait for Changes
- Wait **1-2 minutes** for the changes to propagate
- MongoDB Atlas needs time to update its firewall rules

### Step 5: Verify Backend Connection
After 1-2 minutes, check your backend terminal. You should see:

```
✅ MongoDB Connected: cluster0-shard-00-00.ko7quug.mongodb.net
📊 Database: test

🚀 ========================================
✈️  Flight Booking API Server
🌐 Environment: development
🔗 Server: http://localhost:5000
💚 Health: http://localhost:5000/health
📡 API Base: http://localhost:5000/api
🚀 ========================================
```

## What Happens After Whitelisting?

1. ✅ Backend server will automatically reconnect (nodemon is watching)
2. ✅ MongoDB connection will be established
3. ✅ API endpoints will be available
4. ✅ Signup page will work
5. ✅ Login page will work
6. ✅ All database operations will work

## Test Your Connection

### Test 1: Check Backend Health
Open in browser: **http://localhost:5000/health**

Should return:
```json
{
  "status": "success",
  "message": "Flight Booking API is running",
  "timestamp": "2026-02-20T...",
  "environment": "development"
}
```

### Test 2: Try Signup
1. Go to: **http://localhost:5173/**
2. Click **"Sign Up"**
3. Fill in the form
4. Click **"Sign Up →"**
5. Should see success message and redirect to home

## Troubleshooting

### If backend still doesn't connect after 2 minutes:

1. **Double-check IP whitelist**
   - Go back to Network Access in MongoDB Atlas
   - Verify `61.3.6.147` or `0.0.0.0/0` is in the list
   - Status should be "Active" (green)

2. **Restart backend manually**
   - In backend terminal, press `Ctrl+C`
   - Run: `npm run dev`

3. **Check connection string**
   - Open `backend/.env`
   - Verify `MONGODB_URI` is correct:
   ```
   MONGODB_URI=mongodb+srv://akashraj:akashraj@cluster0.ko7quug.mongodb.net/?appName=Cluster0
   ```

4. **Test connection directly**
   ```bash
   cd backend
   node test-atlas-connection.js
   ```

### If you see "Authentication failed" error:
- Your username or password in the connection string is incorrect
- Go to MongoDB Atlas → Database Access
- Verify user "akashraj" exists and has correct password

### If you see "Network timeout" error:
- Your IP is still not whitelisted
- Wait a bit longer (up to 5 minutes)
- Try restarting backend

## Current Status

### ✅ Fixed Issues
- Removed duplicate index warning in Booking model
- All code is ready and properly configured
- Environment variables are set

### ⏳ Waiting For
- You to whitelist IP: **61.3.6.147** in MongoDB Atlas

### 🎯 After IP Whitelist
- Backend will start successfully
- Signup page will work
- All features will be functional

## Quick Command Reference

```bash
# Check your IP
cd backend
node check-ip.js

# Test MongoDB connection
cd backend
node test-atlas-connection.js

# Restart backend
cd backend
npm run dev

# Check backend health
# Open in browser: http://localhost:5000/health
```

## Need Help?

If you're still having issues after whitelisting your IP:
1. Check the backend terminal for specific error messages
2. Check browser console (F12) for frontend errors
3. Verify all environment variables in `backend/.env`
4. Make sure MongoDB Atlas cluster is running (not paused)

---

**Next Step**: Go to MongoDB Atlas and whitelist your IP (61.3.6.147) now!
