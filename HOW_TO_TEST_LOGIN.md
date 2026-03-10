# 🎯 HOW TO TEST LOGIN - SIMPLE GUIDE

## 🚀 QUICK START (3 Steps)

### Step 1: Open Browser Console
```
1. Open your browser
2. Press F12 key
3. Click "Console" tab
4. Keep it open
```

### Step 2: Go to Login Page
```
Open: http://localhost:5174/login
```

### Step 3: Test Admin Login
```
1. Click "🔐 Admin Login" button (at bottom of page)
2. Enter password: 7013367409
3. Click "Login as Admin"
4. Watch the console!
```

---

## 👀 WHAT YOU'LL SEE

### In Console (if working):
```
🔐 AdminAuthService: Attempting login to: http://localhost:5000/api/admin-auth/login
📡 Admin API Request: http://localhost:5000/api/admin-auth/login
📥 Admin Response status: 200
📥 Admin Response data: {status: 'success', ...}
💾 Admin session stored in sessionStorage
```

### On Screen (if working):
```
✅ Green toast: "Admin login successful!"
✅ Page redirects to: /admin-dashboard
✅ Dashboard shows users and bookings
```

---

## ❌ IF YOU SEE ERRORS

### Copy This Information:
1. **Console errors** (red text in console)
2. **Network tab** (F12 → Network → click on failed request)
3. **Screenshot** of the error

### Share With Me:
Just paste the error message and I'll fix it immediately!

---

## 🔑 CREDENTIALS

### Admin Login
- Password: `7013367409`
- No username needed

### User Login (if you have an account)
- Email: your-email@example.com
- Password: your-password

### Don't Have User Account?
1. Click "Sign Up" on login page
2. Fill in the form
3. Register
4. Then login

---

## 🎯 EXPECTED RESULTS

### ✅ Success Indicators:
- Console shows 200 status
- Toast notification appears
- Page redirects automatically
- No red errors in console

### ❌ Failure Indicators:
- Red errors in console
- No redirect
- Error toast message
- Network request fails

---

## 💡 TIPS

1. **Keep console open** - It shows exactly what's happening
2. **Check Network tab** - Shows all API requests
3. **Clear cache** if needed - Ctrl + Shift + Delete
4. **Refresh page** - Ctrl + F5 (hard refresh)

---

## 🆘 COMMON ISSUES

### "Failed to fetch"
- Backend might not be running
- Check: http://localhost:5000/health

### CORS Error
- Backend CORS needs adjustment
- Share the error message

### 404 Not Found
- Route issue (but we just fixed this!)
- Share the console output

---

## ✅ CHECKLIST

Before testing:
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5174
- [ ] Browser console open (F12)
- [ ] Ready to test!

---

**Ready? Go test it now!** 🚀

Open: http://localhost:5174/login
