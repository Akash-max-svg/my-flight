# 🔄 OAuth Login Flow - Visual Guide

## 📊 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER CLICKS "CONTINUE WITH GOOGLE"            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND: Redirects to /api/auth/google                        │
│  Browser navigates to backend OAuth endpoint                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  BACKEND: Passport initiates OAuth flow                         │
│  Redirects to Google's login page                               │
│  Includes: client_id, redirect_uri, scope                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  GOOGLE: User sees real Google login page                       │
│  User enters email and password                                 │
│  User clicks "Allow" to grant permissions                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  GOOGLE: Redirects back to callback URL                         │
│  URL: /api/auth/google/callback?code=xxx                        │
│  Includes authorization code                                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  BACKEND: Passport receives callback                            │
│  Exchanges code for access token with Google                    │
│  Fetches user profile from Google                               │
│  Profile includes: id, email, name, picture                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  BACKEND: Check if user exists in MongoDB                       │
│  Query: { $or: [{ googleId }, { email }] }                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
    ┌───────────────────┐    ┌───────────────────┐
    │  USER EXISTS      │    │  NEW USER         │
    │  Update googleId  │    │  Create user      │
    │  if not set       │    │  with profile     │
    └─────────┬─────────┘    └─────────┬─────────┘
              │                         │
              └────────────┬────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  BACKEND: User saved in MongoDB                                 │
│  User document includes:                                        │
│  - username: "Akash Medhara"                                    │
│  - email: "akashmedhara@gmail.com"                              │
│  - googleId: "google_user_id"                                   │
│  - provider: "google"                                           │
│  - profilePicture: "https://..."                                │
│  - isEmailVerified: true                                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  BACKEND: Generate JWT tokens                                   │
│  Access Token: { id, email, provider }                          │
│  Refresh Token: { id, email }                                   │
│  Expiry: 7 days / 30 days                                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  BACKEND: Redirect to frontend                                  │
│  URL: /oauth-callback?token=xxx&refreshToken=yyy&provider=google│
│  Browser navigates to frontend callback page                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND: OAuthCallback component loads                        │
│  Extracts tokens from URL parameters                            │
│  🔓 Logs: "Decoded JWT token"                                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND: Decode JWT token                                     │
│  Extract user ID from token payload                             │
│  📡 Logs: "Fetching user details from backend..."               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND: Fetch full user data                                 │
│  API Call: GET /api/users/:id                                   │
│  Headers: Authorization: Bearer <token>                         │
│  📡 Logs: "Response status: 200"                                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  BACKEND: Verify JWT token                                      │
│  Check token signature and expiry                               │
│  Find user by ID in MongoDB                                     │
│  Return user data (without password)                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND: Receive user data                                    │
│  📦 Logs: "User data received"                                  │
│  Merge with tokens: { ...user, token, refreshToken }            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND: Store in localStorage                                │
│  localStorage.setItem('user', JSON.stringify(user))             │
│  localStorage.setItem('isLoggedIn', 'true')                     │
│  ✅ Logs: "OAuth user data stored"                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND: Trigger authChange event                             │
│  window.dispatchEvent(new Event('authChange'))                  │
│  App.jsx listens and updates isLoggedIn state                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND: Show success toast                                   │
│  Toast: "✅ Logged in with Google as Akash Medhara!"            │
│  Navigate to /home after 500ms                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND: Home component loads                                 │
│  Reads user from localStorage                                   │
│  📦 Logs: "Raw user data from localStorage"                     │
│  👤 Logs: "Parsed user data"                                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND: Update UI with user data                             │
│  Display username in header: "Akash Medhara"                    │
│  Display user avatar with initial: "A"                          │
│  Enable user dropdown menu                                      │
│  ✅ Logs: "User data set in state"                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ✅ LOGIN COMPLETE!                            │
│  User can now:                                                  │
│  - View their profile                                           │
│  - Make bookings                                                │
│  - Access all features                                          │
│  - See their name in the UI                                     │
└─────────────────────────────────────────────────────────────────┘
```

## 🔍 Key Points in the Flow

### 1. OAuth Initiation
- User clicks button → Frontend redirects to backend
- Backend uses Passport to redirect to Google
- Google shows real login page

### 2. Google Authentication
- User enters credentials on Google's page
- Google verifies identity
- User grants permissions
- Google redirects back with authorization code

### 3. Backend Processing
- Passport exchanges code for access token
- Fetches user profile from Google
- Creates or updates user in MongoDB
- Generates JWT tokens
- Redirects to frontend with tokens

### 4. Frontend Token Handling
- OAuthCallback receives tokens
- Decodes JWT to get user ID
- Fetches full user data from backend
- Stores everything in localStorage
- Triggers auth state update

### 5. UI Update
- App.jsx detects auth change
- Updates isLoggedIn state
- Home component loads user data
- Displays username and avatar
- User is fully logged in

## 🎯 Critical Success Points

### ✅ Backend Must:
1. Create user with username field
2. Generate valid JWT tokens
3. Redirect with tokens in URL
4. Respond to /api/users/:id with full user data

### ✅ Frontend Must:
1. Decode JWT correctly
2. Fetch user data with Bearer token
3. Store complete user object in localStorage
4. Trigger authChange event
5. Load user data in Home component

## 🚨 Common Failure Points

### ❌ Token Issues
- Invalid JWT_SECRET → Token verification fails
- Expired token → 401 error
- Missing Authorization header → 401 error

### ❌ API Issues
- Backend not running → Fetch fails
- CORS misconfigured → Request blocked
- Wrong endpoint URL → 404 error

### ❌ Data Issues
- User not created → User not found error
- Missing username field → UI shows "User"
- localStorage blocked → Can't store data

### ❌ State Issues
- authChange not triggered → UI doesn't update
- User data not loaded → Blank UI
- React state not updating → Refresh needed

## 📊 Console Log Timeline

When everything works, you'll see logs in this order:

```
1. 🔓 Decoded JWT token: { id: "...", email: "...", provider: "google" }
2. 📡 Fetching user details from backend...
3. 📡 Response status: 200
4. 📦 User data received: { status: "success", data: { user: {...} } }
5. ✅ OAuth user data stored: { username: "...", email: "...", provider: "google" }
6. 📦 Raw user data from localStorage: {"username":"...","email":"...",...}
7. 👤 Parsed user data: { username: "...", email: "...", provider: "google", hasToken: true }
8. ✅ User data set in state
```

## 🎉 Success Indicators

### In Console
- ✅ All logs appear without errors
- ✅ Response status is 200
- ✅ User data includes username
- ✅ No red error messages

### In UI
- ✅ Username appears in header
- ✅ User avatar shows initial
- ✅ Dropdown menu works
- ✅ No "User" placeholder
- ✅ Success toast shows username

### In localStorage
- ✅ 'user' key contains complete object
- ✅ 'isLoggedIn' is "true"
- ✅ User object has username field
- ✅ Token and refreshToken present

---

**This flow is now fully functional with enhanced logging at every step!** 🚀
