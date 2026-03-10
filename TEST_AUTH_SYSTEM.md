# 🧪 Test Authentication System

## Quick Test Guide

### 1. Test Admin Login (Backend API)

**PowerShell Command:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/admin-auth/login" -Method Post -ContentType "application/json" -Body '{"password":"7013367409"}' | ConvertTo-Json
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "sessionToken": "...",
    "admin": {
      "username": "admin",
      "email": "admin@flightbooking.com",
      "role": "superadmin"
    }
  }
}
```

---

### 2. Test User Registration (Backend API)

**PowerShell Command:**
```powershell
$body = @{
  username = "testuser"
  email = "test@example.com"
  password = "Test@123"
  age = 25
  gender = "male"
  mobile = "1234567890"
  country = "India"
  dob = "1999-01-01"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -ContentType "application/json" -Body $body | ConvertTo-Json
```

---

### 3. Test User Login (Backend API)

**PowerShell Command:**
```powershell
$body = @{
  email = "test@example.com"
  password = "Test@123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -ContentType "application/json" -Body $body | ConvertTo-Json
```

---

### 4. Test Admin Login (Frontend)

1. Open browser: http://localhost:5174/login
2. Scroll down to "🔐 Admin Login" button
3. Click it
4. Enter password: **7013367409**
5. Click "Login as Admin"
6. Should redirect to admin dashboard

---

### 5. Test User Login (Frontend)

1. Open browser: http://localhost:5174/login
2. Enter email and password
3. Click "Login →"
4. Should redirect to home page

---

### 6. Test User Signup (Frontend)

1. Open browser: http://localhost:5174/signup
2. Fill in all fields
3. Click "Sign Up →"
4. Should redirect to home page

---

## Verification Checklist

### Backend
- [ ] Admin login endpoint responds (POST /api/admin-auth/login)
- [ ] User register endpoint responds (POST /api/auth/register)
- [ ] User login endpoint responds (POST /api/auth/login)
- [ ] No console errors in backend terminal

### Frontend
- [ ] Login page loads without errors
- [ ] Admin login box appears when clicking "🔐 Admin Login"
- [ ] User login form works
- [ ] Signup page loads without errors
- [ ] No console errors in browser

### Integration
- [ ] Admin can login and access dashboard
- [ ] User can register and login
- [ ] Sessions are properly stored
- [ ] Logout works for both user and admin

---

## Common Issues & Solutions

### Issue: "fetch failed" error
**Solution:** 
- Check if backend is running on port 5000
- Check if frontend is running on port 5174
- Verify CORS settings in backend/server.js

### Issue: Admin login not working
**Solution:**
- Verify admin password is: 7013367409
- Check backend console for errors
- Run setup-admin.js to recreate admin

### Issue: User login not working
**Solution:**
- Verify user exists in database
- Check password is correct
- Verify JWT_SECRET is set in .env

---

## Debug Commands

### Check Backend Health
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/health"
```

### Check MongoDB Connection
```powershell
# Run in backend directory
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✅ Connected')).catch(err => console.log('❌ Error:', err.message));"
```

### View Backend Logs
Check Terminal 4 where backend is running

### View Frontend Logs
Check browser console (F12)

---

## Success Indicators

✅ Backend responds to all endpoints
✅ No CORS errors
✅ Admin can login and see dashboard
✅ Users can register and login
✅ Sessions persist correctly
✅ Logout works properly

---

**Ready to Test!** 🚀
