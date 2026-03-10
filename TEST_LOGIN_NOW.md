# 🎯 TEST LOGIN NOW - QUICK GUIDE

## ⚡ IMMEDIATE TESTING STEPS

### 1. Open Browser Console
- Press `F12` in your browser
- Click on **Console** tab
- Keep it open

### 2. Test Admin Login
1. Go to: **http://localhost:5174/login**
2. Click: **"🔐 Admin Login"** button at the bottom
3. Enter password: **`7013367409`**
4. Click: **"Login as Admin"**
5. **Watch the console** for logs

### 3. What You Should See in Console

#### If Working Correctly:
```
🔐 AdminAuthService: Attempting login to: http://localhost:5000/api/admin-auth/login
📡 Admin API Request: http://localhost:5000/api/admin-auth/login
📥 Admin Response status: 200
📥 Admin Response data: {status: 'success', ...}
💾 Admin session stored in sessionStorage
```
Then you'll be redirected to `/admin-dashboard`

#### If There's an Error:
You'll see red error messages in the console. **Copy and share them with me!**

---

## 🔍 WHAT TO CHECK

### Network Tab (if login fails)
1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Try logging in again
4. Look for the request to `admin-auth/login`
5. Click on it to see:
   - Status code (should be 200)
   - Response data
   - Request headers

### Common Issues to Look For

❌ **CORS Error**
```
Access to fetch at 'http://localhost:5000/api/admin-auth/login' 
from origin 'http://localhost:5174' has been blocked by CORS policy
```
**Solution**: Backend CORS needs adjustment

❌ **Network Error**
```
Failed to fetch
```
**Solution**: Backend might not be running

❌ **404 Not Found**
```
404 - Route not found
```
**Solution**: Route not registered (but we just fixed this!)

---

## ✅ SERVERS STATUS

Both servers should be running:

- **Frontend**: http://localhost:5174 ✅
- **Backend**: http://localhost:5000 ✅

### Quick Health Check
Open this in browser: http://localhost:5000/health

Should show:
```json
{
  "status": "success",
  "message": "Flight Booking API is running",
  "timestamp": "...",
  "environment": "development"
}
```

---

## 🎯 ADMIN CREDENTIALS

- **Password**: `7013367409`
- **Username**: admin (auto-set)
- **Email**: admin@flightbooking.com

---

## 📱 WHAT HAPPENS AFTER LOGIN

### Admin Login Success:
1. Session token saved in `sessionStorage`
2. Admin data saved in `sessionStorage`
3. Toast notification: "Admin login successful!"
4. Redirect to: `/admin-dashboard`
5. Dashboard shows:
   - All users
   - All bookings
   - Statistics
   - Admin controls

### User Login Success:
1. User data saved in `localStorage`
2. Token saved for API requests
3. Toast notification: "Login successful!"
4. Redirect to: `/home`
5. User sees their personal dashboard

---

## 🚨 IF IT DOESN'T WORK

**Please share:**
1. Screenshot of browser console (F12 → Console tab)
2. Screenshot of Network tab showing the failed request
3. Any error messages you see

I'll fix it immediately!

---

## 💡 TIP

The console logs will show you EXACTLY what's happening:
- What URL is being called
- What data is being sent
- What response is received
- Any errors that occur

This makes debugging super easy!
