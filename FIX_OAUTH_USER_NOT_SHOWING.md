# 🔧 Fix: OAuth User Data Not Showing

## 🐛 Problem

After Google OAuth login:
- ❌ User logo not showing
- ❌ User details not visible in navbar
- ❌ Asks to login again
- ❌ Shows "Login/Signup" buttons instead of user menu

## 🔍 Root Cause

The user data is being saved to localStorage, but the UI is not reading it correctly OR the data structure is incomplete.

## ✅ Complete Fix

### Step 1: Test Current Status

Open browser console (F12) and run:

```javascript
// Check if data exists
console.log('User:', localStorage.getItem('user'));
console.log('Login Flag:', localStorage.getItem('isLoggedIn'));

// Check auth status
window.checkAuthStatus();
```

**If you see `null` or `undefined`:** Data is not being saved
**If you see data but UI doesn't update:** React state issue

---

### Step 2: Clear Everything and Test Fresh

```javascript
// Clear all data
localStorage.clear();

// Reload
window.location.href = 'http://localhost:5174/login';
```

Then:
1. Click "Continue with Google"
2. Login with Google
3. Watch console logs
4. Check if username appears

---

### Step 3: Manual Test (Verify UI Works)

Run this in console to test if UI can display user data:

```javascript
// Manually set user data
const testUser = {
  _id: 'test123',
  username: 'Test User',
  email: 'test@gmail.com',
  provider: 'google',
  googleId: '123456',
  age: 25,
  gender: 'male',
  mobile: '1234567890',
  country: 'India',
  role: 'user',
  token: 'test_token',
  refreshToken: 'test_refresh',
  loginTime: new Date().toLocaleString()
};

// Save to localStorage
localStorage.setItem('user', JSON.stringify(testUser));
localStorage.setItem('isLoggedIn', 'true');

// Trigger auth change
window.dispatchEvent(new Event('authChange'));

// Reload page
window.location.reload();
```

**If username appears:** OAuth callback is the problem
**If username still doesn't appear:** UI/React state is the problem

---

### Step 4: Check Backend Response

After OAuth login, check Network tab:

1. Open DevTools → Network tab
2. Click "Continue with Google"
3. Look for request to `/api/users/:id`
4. Check response

**Expected Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "...",
      "username": "Akash Medhara",
      "email": "akashmedhara@gmail.com",
      "googleId": "...",
      "provider": "google",
      "age": 25,
      "gender": "prefer-not-to-say",
      "mobile": "0000000000",
      "country": "Not specified",
      "role": "user"
    }
  }
}
```

**If 401 error:** Token authentication failed
**If 404 error:** User not found in database
**If 500 error:** Backend error

---

### Step 5: Fix Backend User Creation

The issue might be that the user is not being created properly in MongoDB.

Check backend logs when you login with Google. You should see:

```
🔵 Google OAuth - Profile received: { id: "...", email: "...", name: "..." }
✅ New user created via Google: akashmedhara@gmail.com
```

OR

```
✅ Existing user logged in via Google: akashmedhara@gmail.com
```

**If you don't see these logs:** Backend OAuth is not working

---

### Step 6: Verify MongoDB User

Check if user was created in MongoDB:

1. Go to MongoDB Atlas
2. Browse Collections
3. Find Users collection
4. Search for your email

**User should have:**
```json
{
  "_id": "...",
  "username": "Akash Medhara",
  "email": "akashmedhara@gmail.com",
  "googleId": "...",
  "provider": "google",
  "password": "OAUTH_USER_...",
  "age": 25,
  "gender": "prefer-not-to-say",
  "mobile": "0000000000",
  "country": "Not specified",
  "isEmailVerified": true,
  "role": "user"
}
```

**If user doesn't exist:** Backend is not creating user
**If user exists but missing fields:** User creation is incomplete

---

## 🔧 Common Fixes

### Fix 1: localStorage Blocked

**Problem:** Browser blocking localStorage

**Test:**
```javascript
try {
  localStorage.setItem('test', 'value');
  console.log('✅ localStorage works');
  localStorage.removeItem('test');
} catch (e) {
  console.error('❌ localStorage blocked:', e);
}
```

**Solutions:**
- Disable private/incognito mode
- Disable tracking prevention
- Try different browser (Chrome recommended)
- Check browser settings

---

### Fix 2: Backend Not Running

**Problem:** Backend server stopped

**Test:**
```javascript
fetch('http://localhost:5000/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend:', d))
  .catch(e => console.error('❌ Backend:', e));
```

**Solution:**
```bash
cd backend
npm start
```

---

### Fix 3: Token Invalid

**Problem:** JWT token not valid

**Check backend/.env:**
```env
JWT_SECRET=flight-booking-super-secret-jwt-key-2026-akgroup
```

**Solution:** Restart backend after verifying JWT_SECRET

---

### Fix 4: CORS Issue

**Problem:** Frontend can't access backend

**Check backend/server.js:**
```javascript
app.use(cors({
  origin: 'http://localhost:5174',  // Should match frontend URL
  credentials: true
}));
```

**Solution:** Update CORS origin and restart backend

---

### Fix 5: React State Not Updating

**Problem:** localStorage has data but UI doesn't update

**Solution:**
```javascript
// Force auth change
window.dispatchEvent(new Event('authChange'));

// Wait and reload
setTimeout(() => {
  window.location.reload();
}, 500);
```

---

## 🎯 Complete Debug Checklist

Run these commands in order and share results:

```javascript
// 1. Check localStorage
console.log('=== STEP 1: localStorage ===');
console.log('user:', localStorage.getItem('user'));
console.log('isLoggedIn:', localStorage.getItem('isLoggedIn'));

// 2. Parse user data
console.log('=== STEP 2: Parsed User ===');
try {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('User object:', user);
  console.log('Has username:', !!user?.username);
  console.log('Has email:', !!user?.email);
  console.log('Has token:', !!user?.token);
} catch (e) {
  console.error('Parse error:', e);
}

// 3. Check auth status
console.log('=== STEP 3: Auth Status ===');
window.checkAuthStatus();

// 4. Test backend
console.log('=== STEP 4: Backend Test ===');
fetch('http://localhost:5000/health')
  .then(r => r.json())
  .then(d => console.log('Backend:', d))
  .catch(e => console.error('Backend error:', e));

// 5. Test localStorage
console.log('=== STEP 5: localStorage Test ===');
try {
  localStorage.setItem('test', 'value');
  const val = localStorage.getItem('test');
  localStorage.removeItem('test');
  console.log('localStorage works:', val === 'value');
} catch (e) {
  console.error('localStorage blocked:', e);
}
```

---

## 📊 Expected vs Actual

### Expected After OAuth Login:

**Console Logs:**
```
🔓 Decoded JWT token: {...}
📡 Fetching user details from backend...
📡 Response status: 200
📦 User data received: {...}
💾 Stored in localStorage: user: YES, isLoggedIn: true
📢 authChange event dispatched
✅ OAuth user data stored: {...}
🔍 Verification before navigation: localStorage.user exists: true
🚀 Navigating to /home...
```

**UI:**
- ✅ Username in top-right corner
- ✅ User avatar/logo
- ✅ User dropdown menu
- ✅ NO "Login/Signup" buttons

**localStorage:**
```javascript
{
  user: "{\"_id\":\"...\",\"username\":\"Akash Medhara\",\"email\":\"akashmedhara@gmail.com\",...}",
  isLoggedIn: "true"
}
```

### Actual (Problem):

**Console Logs:**
- ❓ May show errors
- ❓ May stop at certain step
- ❓ May show "user: NO"

**UI:**
- ❌ No username
- ❌ Shows "Login/Signup" buttons
- ❌ Asks to login again

**localStorage:**
- ❓ May be empty
- ❓ May have incomplete data

---

## 🆘 If Nothing Works

### Collect Complete Debug Info:

```javascript
console.log('=== COMPLETE DEBUG INFO ===');
console.log('1. Browser:', navigator.userAgent);
console.log('2. URL:', window.location.href);
console.log('3. localStorage.user:', localStorage.getItem('user'));
console.log('4. localStorage.isLoggedIn:', localStorage.getItem('isLoggedIn'));
console.log('5. Auth status:', window.checkAuthStatus());
console.log('6. Cookies:', document.cookie);

// Test backend
fetch('http://localhost:5000/health')
  .then(r => r.json())
  .then(d => console.log('7. Backend health:', d))
  .catch(e => console.log('7. Backend error:', e));

// Test localStorage
try {
  localStorage.setItem('test', 'value');
  console.log('8. localStorage works: YES');
  localStorage.removeItem('test');
} catch (e) {
  console.log('8. localStorage works: NO', e);
}

console.log('===========================');
```

### Share This Info:
1. All console logs (copy entire console)
2. Screenshot of UI after OAuth login
3. Backend terminal output
4. Network tab screenshot (showing /api/users/:id request)

---

## 🎯 Quick Test Script

Run this complete test:

```javascript
// Complete OAuth Test
(async function() {
  console.log('🧪 Starting OAuth Debug Test...\n');
  
  // Test 1: localStorage
  console.log('Test 1: localStorage');
  try {
    localStorage.setItem('test', 'value');
    localStorage.removeItem('test');
    console.log('✅ localStorage: WORKING\n');
  } catch (e) {
    console.log('❌ localStorage: BLOCKED\n');
    return;
  }
  
  // Test 2: Backend
  console.log('Test 2: Backend');
  try {
    const res = await fetch('http://localhost:5000/health');
    const data = await res.json();
    console.log('✅ Backend: RUNNING');
    console.log('   Status:', data.status, '\n');
  } catch (e) {
    console.log('❌ Backend: DOWN\n');
    return;
  }
  
  // Test 3: Current Auth
  console.log('Test 3: Current Auth Status');
  const user = localStorage.getItem('user');
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  console.log('   User exists:', !!user);
  console.log('   Login flag:', isLoggedIn);
  if (user) {
    try {
      const parsed = JSON.parse(user);
      console.log('   Username:', parsed.username);
      console.log('   Email:', parsed.email);
      console.log('   Provider:', parsed.provider);
    } catch (e) {
      console.log('   Parse error:', e.message);
    }
  }
  console.log('\n');
  
  // Test 4: Recommendation
  console.log('📋 Recommendation:');
  if (!user || isLoggedIn !== 'true') {
    console.log('   ⚠️ Not logged in. Try OAuth login again.');
    console.log('   1. Clear data: localStorage.clear()');
    console.log('   2. Go to: http://localhost:5174/login');
    console.log('   3. Click "Continue with Google"');
  } else {
    console.log('   ✅ User data exists!');
    console.log('   If UI not showing user, try:');
    console.log('   window.dispatchEvent(new Event("authChange"));');
    console.log('   window.location.reload();');
  }
  
  console.log('\n🧪 Test Complete!');
})();
```

---

## ✅ Success Criteria

OAuth login is working when:
1. ✅ Console shows all expected logs
2. ✅ `localStorage.getItem('user')` returns user data
3. ✅ `localStorage.getItem('isLoggedIn')` returns "true"
4. ✅ `window.checkAuthStatus()` shows `isLoggedIn: true`
5. ✅ Username appears in navbar
6. ✅ User dropdown menu works
7. ✅ Can book flights
8. ✅ Can view bookings

---

**Run the Quick Test Script above and share the results!** 🚀

This will tell us exactly where the problem is.
