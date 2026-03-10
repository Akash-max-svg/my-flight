# 🐛 Debug OAuth Login Issue

## 🔍 Problem

After Google OAuth login:
- User details not showing
- Navbar shows "Login/Signup" buttons instead of user menu
- Appears as if user is not logged in

## 🧪 Debug Steps

### Step 1: Open Browser Console
Press **F12** → Click **Console** tab

### Step 2: Check Auth Status
Run this command in console:
```javascript
window.checkAuthStatus()
```

**Expected Output:**
```javascript
{
  isLoggedIn: true,
  user: "{...user data...}",
  loginFlag: "true"
}
```

**If you see:**
```javascript
{
  isLoggedIn: false,
  user: null,
  loginFlag: null
}
```
→ OAuth callback didn't store data properly

### Step 3: Check localStorage Directly
```javascript
// Check if user data exists
console.log('User:', localStorage.getItem('user'));
console.log('Login Flag:', localStorage.getItem('isLoggedIn'));

// Parse user data
try {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('Parsed User:', user);
} catch (e) {
  console.error('Failed to parse user:', e);
}
```

**Expected:**
- User: Should show JSON string with user data
- Login Flag: Should be "true"
- Parsed User: Should show object with username, email, etc.

### Step 4: Test OAuth Flow
1. Clear everything first:
```javascript
localStorage.clear();
window.location.reload();
```

2. Go to login page:
```
http://localhost:5174/login
```

3. Click "Continue with Google"

4. Watch console logs during OAuth:
```
🔓 Decoded JWT token: {...}
📡 Fetching user details from backend...
📡 Response status: 200
📦 User data received: {...}
✅ OAuth user data stored: {...}
```

5. After redirect to home, check:
```javascript
window.checkAuthStatus()
```

### Step 5: Check App.jsx State
Add this to console after OAuth login:
```javascript
// This should trigger auth check
window.dispatchEvent(new Event('authChange'));

// Wait 1 second, then check
setTimeout(() => {
  window.checkAuthStatus();
}, 1000);
```

## 🚨 Common Issues

### Issue 1: localStorage Not Persisting
**Symptoms:**
- Data stored but disappears on page change
- `window.checkAuthStatus()` shows null

**Causes:**
- Browser in private/incognito mode
- Tracking prevention enabled
- localStorage blocked by browser

**Solution:**
```javascript
// Test if localStorage works
try {
  localStorage.setItem('test', 'value');
  const val = localStorage.getItem('test');
  localStorage.removeItem('test');
  console.log('✅ localStorage working:', val === 'value');
} catch (e) {
  console.error('❌ localStorage blocked:', e);
}
```

### Issue 2: authChange Event Not Firing
**Symptoms:**
- Data in localStorage but UI doesn't update
- Refresh page shows user logged in

**Solution:**
```javascript
// Manually trigger auth change
localStorage.setItem('isLoggedIn', 'true');
window.dispatchEvent(new Event('authChange'));
```

### Issue 3: Token Not Being Passed
**Symptoms:**
- Console shows "No authentication token received"
- Redirect happens but no token in URL

**Check:**
1. Backend logs - should show token generation
2. URL after redirect - should have `?token=xxx&refreshToken=yyy`
3. Network tab - check redirect response

### Issue 4: User API Call Failing
**Symptoms:**
- Console shows "Failed to fetch user details: 401"
- Fallback user data used

**Solution:**
```javascript
// Check if backend is running
fetch('http://localhost:5000/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend:', d))
  .catch(e => console.error('❌ Backend down:', e));
```

## 🔧 Quick Fixes

### Fix 1: Force Re-login
```javascript
// Clear everything
localStorage.clear();

// Reload page
window.location.href = 'http://localhost:5174/login';
```

### Fix 2: Manual Login (Testing)
```javascript
// Manually set user data for testing
const testUser = {
  _id: 'test123',
  username: 'Test User',
  email: 'test@example.com',
  provider: 'google',
  token: 'test_token',
  loginTime: new Date().toLocaleString()
};

localStorage.setItem('user', JSON.stringify(testUser));
localStorage.setItem('isLoggedIn', 'true');
window.dispatchEvent(new Event('authChange'));

// Reload
window.location.reload();
```

### Fix 3: Check Backend Response
Open Network tab in DevTools:
1. Click "Continue with Google"
2. Watch for redirect to `/api/auth/google/callback`
3. Check response - should be 302 redirect with token in URL
4. If 401/403 - backend auth issue
5. If 500 - backend error

## 📊 Expected Console Logs

### During OAuth Login:
```
🔵 Google OAuth - Profile received: { id: "...", email: "...", name: "..." }
✅ Existing user logged in via Google: user@example.com
```

### During Callback:
```
🔓 Decoded JWT token: { id: "...", email: "...", provider: "google" }
📡 Fetching user details from backend...
📡 Response status: 200
📦 User data received: { status: "success", data: { user: {...} } }
✅ OAuth user data stored: { username: "...", email: "...", provider: "google" }
```

### After Redirect to Home:
```
🔐 Auth Check: { user: true, loginFlag: "true", authStatus: true, userDetails: {...} }
📦 Raw user data from localStorage: {"username":"...","email":"...",...}
👤 Parsed user data: { username: "...", email: "...", provider: "google", hasToken: true }
✅ User data set in state
```

## 🎯 Verification Checklist

After OAuth login, verify:
- [ ] Console shows "✅ OAuth user data stored"
- [ ] Console shows "✅ User data set in state"
- [ ] `window.checkAuthStatus()` shows `isLoggedIn: true`
- [ ] `localStorage.getItem('user')` returns user data
- [ ] `localStorage.getItem('isLoggedIn')` returns "true"
- [ ] Username appears in navbar (not Login/Signup buttons)
- [ ] User dropdown menu works
- [ ] No errors in console

## 🔄 Complete Reset

If nothing works, do a complete reset:

```javascript
// 1. Clear all data
localStorage.clear();
sessionStorage.clear();

// 2. Clear cookies (optional)
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});

// 3. Reload
window.location.href = 'http://localhost:5174';

// 4. Try OAuth login again
```

## 📝 Report Issue

If problem persists, collect this info:

```javascript
// Run this and share output
console.log('=== DEBUG INFO ===');
console.log('localStorage.user:', localStorage.getItem('user'));
console.log('localStorage.isLoggedIn:', localStorage.getItem('isLoggedIn'));
console.log('window.checkAuthStatus:', window.checkAuthStatus());
console.log('Browser:', navigator.userAgent);
console.log('URL:', window.location.href);
console.log('==================');
```

---

**Start with Step 1 and work through each step!**
