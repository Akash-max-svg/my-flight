# How to Connect Backend - Complete Guide

## 🎯 Current Situation

**Frontend**: ✅ Running on http://localhost:5173/  
**Backend**: ❌ Crashed - Cannot connect to MongoDB Atlas

**Error**: "Could not connect to any servers in your MongoDB Atlas cluster"

---

## 🔧 Step-by-Step Solution

### STEP 1: Open MongoDB Atlas

1. Go to: **https://cloud.mongodb.com/**
2. Sign in with your account
3. You should see your dashboard

---

### STEP 2: Whitelist Your IP Address

#### A. Go to Network Access:
1. Look at the **left sidebar**
2. Find **"Security"** section
3. Click **"Network Access"**

#### B. Add Your IP:
1. Click the green **"ADD IP ADDRESS"** button (top right)
2. A dialog will appear with two options:

**Option 1 (Recommended):**
- Click **"ADD CURRENT IP ADDRESS"**
- It should auto-fill: `61.3.117.22`
- Add comment: "Development Machine"
- Click **"Confirm"**

**Option 2 (Quick Testing):**
- Click **"ALLOW ACCESS FROM ANYWHERE"**
- It will add: `0.0.0.0/0`
- Add comment: "Testing"
- Click **"Confirm"**

#### C. Wait:
- Wait **2-3 minutes** for changes to apply
- You'll see the IP in the list with status "Active" (green dot)

---

### STEP 3: Fix Database User Credentials

#### A. Go to Database Access:
1. Look at the **left sidebar**
2. Find **"Security"** section
3. Click **"Database Access"**

#### B. Check if User Exists:
Look for username: **akashraj**

**If user EXISTS:**
1. Click **"Edit"** button (pencil icon) next to the user
2. Click **"Edit Password"**
3. Enter new password: `Akash@123` (or any password you want)
4. **Write down this password!**
5. Click **"Update User"**

**If user DOESN'T EXIST:**
1. Click **"ADD NEW DATABASE USER"** button
2. **Authentication Method**: Password
3. **Username**: `akashraj`
4. **Password**: `Akash@123` (or click "Autogenerate")
5. **Write down this password!**
6. **Database User Privileges**: Select "Atlas admin"
7. Click **"Add User"**

---

### STEP 4: Update Your .env File

#### A. Open the file:
Open `backend/.env` in your editor

#### B. Update line 6:
Change this line:
```env
MONGODB_URI=mongodb+srv://akashraj:akashraj@cluster0.ko7quug.mongodb.net/?appName=Cluster0
```

To this (with your new password):
```env
MONGODB_URI=mongodb+srv://akashraj:Akash@123@cluster0.ko7quug.mongodb.net/?appName=Cluster0
```

**Important**: Replace `Akash@123` with whatever password you set in Step 3!

#### C. Save the file:
Press **Ctrl+S** to save

---

### STEP 5: Test the Connection

Open terminal and run:

```bash
cd backend
node quick-test.js
```

**If successful, you'll see:**
```
✅ SUCCESS! MongoDB Connected!
📊 Database: test
🌐 Host: cluster0-shard-00-00.ko7quug.mongodb.net
🎉 Your backend should work now!
```

**If it fails:**
- Double-check the password in `.env`
- Make sure you saved the file
- Wait another 2 minutes
- Try again

---

### STEP 6: Restart Backend Server

#### Option A - Auto Restart:
If nodemon is running, it should auto-restart when you save `.env`

#### Option B - Manual Restart:
1. Go to the backend terminal
2. Press **Ctrl+C** to stop
3. Run: `npm run dev`

#### Option C - Quick Restart:
1. Go to the backend terminal
2. Type: `rs` and press Enter

---

### STEP 7: Verify Backend is Running

Check the backend terminal. You should see:

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

---

### STEP 8: Test Backend API

Open your browser and go to:

**http://localhost:5000/health**

You should see:
```json
{
  "status": "success",
  "message": "Flight Booking API is running",
  "timestamp": "2026-02-23T...",
  "environment": "development"
}
```

---

### STEP 9: Test Signup

1. Go to: **http://localhost:5173/**
2. Click **"Sign Up"**
3. Fill in the form:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `Test@123456`
   - Confirm Password: `Test@123456`
   - Gender: Male
   - Mobile: `9876543210`
   - Age: `25`
   - Country: `India`
   - DOB: `1999-01-15`
4. Click **"Sign Up →"**

**Success**: You'll see a success message and redirect to home page!

---

## 🎯 Quick Checklist

Before testing, make sure:

- [ ] MongoDB Atlas account is open
- [ ] IP address whitelisted (61.3.117.22 or 0.0.0.0/0)
- [ ] Database user created (username: akashraj)
- [ ] Password is set and you know it
- [ ] `.env` file updated with correct password
- [ ] `.env` file is saved
- [ ] Backend server restarted
- [ ] Connection test passed: `node quick-test.js`
- [ ] Backend shows "MongoDB Connected" message
- [ ] Health endpoint works: http://localhost:5000/health

---

## 🚨 Common Issues & Solutions

### Issue 1: "Could not connect to any servers"
**Cause**: IP not whitelisted  
**Solution**: Add IP 61.3.117.22 or 0.0.0.0/0 in Network Access

### Issue 2: "bad auth : authentication failed"
**Cause**: Wrong username or password  
**Solution**: Reset password in Database Access, update `.env`

### Issue 3: "Connection timeout"
**Cause**: Cluster is paused or IP not whitelisted  
**Solution**: Resume cluster, check Network Access

### Issue 4: Backend keeps crashing
**Cause**: MongoDB connection failing  
**Solution**: Follow all steps above carefully

### Issue 5: Changes not applying
**Cause**: `.env` file not saved or backend not restarted  
**Solution**: Save file (Ctrl+S), restart backend (rs)

---

## 💡 Easiest Setup (If Nothing Works)

Try this simple configuration:

### 1. MongoDB Atlas - Network Access:
```
IP Address: 0.0.0.0/0
Comment: Testing - Allow All
```

### 2. MongoDB Atlas - Database Access:
```
Username: testuser
Password: Test123456
Privileges: Atlas admin
```

### 3. Update backend/.env:
```env
MONGODB_URI=mongodb+srv://testuser:Test123456@cluster0.ko7quug.mongodb.net/?appName=Cluster0
```

### 4. Save and restart:
```bash
# Save .env file (Ctrl+S)
# In backend terminal:
rs
```

This should definitely work!

---

## 📊 Visual Guide

### MongoDB Atlas Dashboard Structure:
```
MongoDB Atlas
├── Database (Cluster0)
├── Security
│   ├── Network Access ← Add IP here (61.3.117.22)
│   └── Database Access ← Add user here (akashraj)
├── Data Services
└── Settings
```

### Your Project Structure:
```
my-flight/
├── backend/
│   ├── .env ← Update connection string here
│   ├── server.js
│   ├── quick-test.js ← Test connection
│   └── package.json
└── src/
    └── (frontend files)
```

---

## 🎉 Success Indicators

### You'll know it's working when:

1. ✅ Backend terminal shows "MongoDB Connected"
2. ✅ http://localhost:5000/health returns success
3. ✅ Signup page creates user successfully
4. ✅ Login page works
5. ✅ No error messages in backend terminal

---

## 🆘 Still Need Help?

### Check Your Current IP:
```bash
cd backend
node check-ip.js
```

### Test MongoDB Connection:
```bash
cd backend
node quick-test.js
```

### View Backend Logs:
Look at the backend terminal for error messages

### Check MongoDB Atlas Status:
- Network Access: IP should show "Active"
- Database Access: User should show "Active"
- Cluster: Should not be "Paused"

---

## 📞 Summary

**What you need to do:**

1. **MongoDB Atlas** → Network Access → Add IP: `61.3.117.22` or `0.0.0.0/0`
2. **MongoDB Atlas** → Database Access → Create/Edit user: `akashraj` with password
3. **Update** `backend/.env` with correct password
4. **Save** the file (Ctrl+S)
5. **Restart** backend (type `rs` in terminal)
6. **Test** connection: `node quick-test.js`
7. **Verify** backend is running: http://localhost:5000/health
8. **Try** signup: http://localhost:5173/

**Time needed**: 5-10 minutes

**Result**: Full-stack application working! 🚀

---

**👉 Start with Step 1 and follow each step carefully!**
