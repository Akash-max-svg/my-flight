# 🔧 FIX MONGODB CONNECTION - QUICK GUIDE

**Your servers are running, just need to connect MongoDB!**

---

## ⚡ QUICK FIX (2 Minutes)

### Step 1: Get Your IP Address
```
Go to: https://www.whatismyip.com/
Copy the IP address shown
```

### Step 2: Add to MongoDB Atlas
```
1. Go to: https://cloud.mongodb.com/
2. Login with your MongoDB account
3. Select your project/cluster
4. Click "Network Access" (left sidebar)
5. Click "Add IP Address" button
6. Paste your IP address
7. Click "Confirm"
```

### Step 3: Wait & Test
```
Wait: 1-2 minutes for changes to apply
Test: Try logging in at http://localhost:5173
```

---

## 🎯 ALTERNATIVE: Allow All IPs (Quick Test)

**⚠️ Only for development/testing**

```
1. MongoDB Atlas → Network Access
2. Add IP Address
3. Click "Allow Access from Anywhere"
4. Enter: 0.0.0.0/0
5. Click "Confirm"
```

---

## ✅ HOW TO KNOW IT'S WORKING

### Backend Terminal Will Show:
```
Before:
❌ MongoDB Connection Error: IP not whitelisted

After:
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
✅ Server running on port 5000
```

### You Can Then:
```
✅ Login/Signup
✅ Book flights
✅ View bookings
✅ Cancel bookings
✅ Everything works!
```

---

## 🚀 YOUR SERVERS ARE READY

```
Frontend: ✅ http://localhost:5173
Backend:  ✅ http://localhost:5000
MongoDB:  ⏳ Waiting for IP whitelist
```

**Just whitelist your IP and you're done!**
