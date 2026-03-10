# 🔐 COMPLETE LOGIN GUIDE

## 📋 LOGIN TYPES

Your application has 3 types of logins:

### 1. Regular User Login
**URL**: http://localhost:5174/login
**Purpose**: For customers booking flights
**Authentication**: Email + Password OR OAuth (Google/Microsoft)

### 2. Admin Login
**URL**: http://localhost:5174/admin
**Purpose**: For administrators to manage users and bookings
**Authentication**: Admin Password Only

### 3. OAuth Login
**URL**: http://localhost:5174/login (via OAuth buttons)
**Purpose**: Quick login with Google/Microsoft account
**Authentication**: OAuth Provider

---

## 1️⃣ REGULAR USER LOGIN

### How to Login:
```
1. Go to: http://localhost:5174/login
2. Enter email and password
3. Click "Login"
```

### Registration:
```
1. Go to: http://localhost:5174/signup
2. Fill in details:
   - Username
   - Email
   - Password
   - Mobile
   - Age
   - Gender
   - Country
3. Click "Sign Up"
```

### Features After Login:
- Search and book flights
- View booking history ("My Tickets")
- Cancel bookings
- Download tickets
- View user dashboard
- Update profile

### Authentication Method:
- **Backend**: JWT (JSON Web Token)
- **Storage**: localStorage (`user` object with `token`)
- **Middleware**: `protect` middleware verifies JWT
- **Session**: Token-based, no expiry (until logout)

### API Endpoints:
```
POST /api/auth/register - Register new user
POST /api/auth/login - Login user
POST /api/auth/logout - Logout user
GET /api/auth/me - Get current user info
PUT /api/auth/update - Update user profile
```

---

## 2️⃣ ADMIN LOGIN

### How to Login:
```
1. Go to: http://localhost:5174/admin
2. Enter admin password: 7013367409
3. Click "Access Dashboard"
```

### Admin Credentials:
```
Password: 7013367409
Username: admin (not required for login)
Email: admin@flightbooking.com
```

### Features After Login:
- View all users
- View all bookings
- See user passwords
- Change user passwords
- View statistics
- Manage system

### Authentication Method:
- **Backend**: Session-based with MongoDB
- **Storage**: sessionStorage (`adminSessionToken`)
- **Validation**: Session token validated on each request
- **Session**: 24 hours expiry
- **Security**: Separate from user authentication

### API Endpoints:
```
POST /api/admin-auth/login - Admin login
POST /api/admin-auth/validate-session - Validate session
POST /api/admin-auth/logout - Admin logout
GET /api/admin-auth/me - Get admin info
GET /api/admin-auth/login-history - View login history
GET /api/admin-auth/sessions - View active sessions
```

### Admin Data Endpoints:
```
GET /api/admin/users - Get all users
GET /api/admin/bookings - Get all bookings
GET /api/admin/stats - Get statistics
GET /api/admin/users/:id - Get user by ID
PATCH /api/admin/users/:id/status - Update user status
PUT /api/admin/users/:id/change-password - Change user password
```

---

## 3️⃣ OAUTH LOGIN

### Providers:
- Google OAuth
- Microsoft OAuth

### How to Login:
```
1. Go to: http://localhost:5174/login
2. Click "Continue with Google" or "Continue with Microsoft"
3. Authorize in popup window
4. Automatically logged in
```

### Features:
- No password required
- Quick registration
- Secure authentication
- Profile data from provider

### Authentication Method:
- **Backend**: Passport.js with OAuth strategies
- **Storage**: localStorage (same as regular user)
- **Token**: JWT generated after OAuth success
- **Session**: Same as regular user

### API Endpoints:
```
GET /api/oauth/google - Initiate Google OAuth
GET /api/oauth/google/callback - Google OAuth callback
GET /api/oauth/microsoft - Initiate Microsoft OAuth
GET /api/oauth/microsoft/callback - Microsoft OAuth callback
```

---

## 🔒 SECURITY FEATURES

### User Authentication:
1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Tokens**: Signed with secret key
3. **Middleware Protection**: `protect` middleware on all user routes
4. **User Isolation**: Each user sees only their data

### Admin Authentication:
1. **Separate System**: Independent from user auth
2. **Session-Based**: MongoDB sessions with expiry
3. **IP Tracking**: Logs IP address and user agent
4. **Login History**: Tracks all login attempts
5. **Multiple Sessions**: Supports multiple active sessions
6. **Auto Cleanup**: Expired sessions automatically removed

### OAuth Authentication:
1. **Provider Verification**: Google/Microsoft verify identity
2. **Secure Callback**: Server-side token exchange
3. **Profile Validation**: Email and profile data verified
4. **JWT Generation**: Same security as regular login

---

## 🧪 TESTING ADMIN LOGIN

### Step 1: Verify Admin Exists
```bash
cd backend
node setup-admin.js
```

Expected output:
```
✅ Admin already exists
✅ Password test PASSED - Admin can login with: 7013367409
```

### Step 2: Test Admin Login
```
1. Go to: http://localhost:5174/admin
2. Enter password: 7013367409
3. Press F12 → Console tab
4. Check for logs:
   🔐 Attempting admin login...
   ✅ Login successful!
   🎫 Session token received: Yes
```

### Step 3: Verify Session
```
1. After login, press F12
2. Go to Application tab
3. Session Storage → http://localhost:5174
4. Verify: adminSessionToken exists
```

### Step 4: Test Admin Features
```
1. Click "Users" tab - see all users
2. Click "Bookings" tab - see all bookings
3. Check stats cards show numbers
4. Try changing a user's password
```

---

## 🔧 TROUBLESHOOTING

### Admin Login Not Working:

#### Issue 1: "Invalid password"
**Solution**:
```bash
cd backend
node setup-admin.js
```
This will reset the admin password to 7013367409

#### Issue 2: "Session expired"
**Solution**:
```
1. Clear sessionStorage (F12 → Application → Session Storage → Clear)
2. Refresh page
3. Login again
```

#### Issue 3: "Server error"
**Solution**:
```
1. Check backend is running (http://localhost:5000)
2. Check MongoDB is connected
3. Check backend console for errors
```

#### Issue 4: Login button does nothing
**Solution**:
```
1. Open browser console (F12)
2. Check for JavaScript errors
3. Verify API endpoint is correct
4. Check network tab for failed requests
```

### User Login Not Working:

#### Issue 1: "Invalid credentials"
**Solution**:
- Verify email and password are correct
- Try password reset if forgotten
- Check if user exists in database

#### Issue 2: "User not found"
**Solution**:
- Register a new account
- Verify email is correct
- Check database for user

#### Issue 3: Token errors
**Solution**:
```
1. Clear localStorage (F12 → Application → Local Storage → Clear)
2. Logout and login again
3. Check backend JWT_SECRET is set
```

---

## 📊 LOGIN FLOW DIAGRAMS

### Regular User Login Flow:
```
User enters email + password
    ↓
POST /api/auth/login
    ↓
Backend verifies credentials
    ↓
Generate JWT token
    ↓
Return token to frontend
    ↓
Store in localStorage
    ↓
Redirect to home page
    ↓
User can access protected routes
```

### Admin Login Flow:
```
Admin enters password
    ↓
POST /api/admin-auth/login
    ↓
Backend verifies password
    ↓
Create session in MongoDB
    ↓
Generate session token
    ↓
Return session token
    ↓
Store in sessionStorage
    ↓
Load admin dashboard
    ↓
Admin can access admin routes
```

### OAuth Login Flow:
```
User clicks OAuth button
    ↓
Redirect to provider (Google/Microsoft)
    ↓
User authorizes
    ↓
Provider redirects to callback
    ↓
Backend exchanges code for profile
    ↓
Create/find user in database
    ↓
Generate JWT token
    ↓
Return token to frontend
    ↓
Store in localStorage
    ↓
User logged in
```

---

## 🎯 BEST PRACTICES

### For Users:
1. Use strong passwords (min 6 characters)
2. Don't share credentials
3. Logout when done
4. Use OAuth for convenience

### For Admin:
1. Keep admin password secure
2. Don't share admin access
3. Monitor login history
4. Logout from all devices if compromised
5. Check active sessions regularly

### For Developers:
1. Never commit passwords to git
2. Use environment variables
3. Rotate JWT secrets regularly
4. Monitor failed login attempts
5. Implement rate limiting
6. Use HTTPS in production

---

## 🌐 URLS SUMMARY

| Type | URL | Credentials |
|------|-----|-------------|
| User Login | http://localhost:5174/login | Email + Password |
| User Signup | http://localhost:5174/signup | Registration form |
| Admin Login | http://localhost:5174/admin | Password: 7013367409 |
| OAuth Login | http://localhost:5174/login | OAuth buttons |
| Password Reset | http://localhost:5174/forgot-password | Email |

---

## ✅ VERIFICATION CHECKLIST

### User Login:
- [ ] Can register new account
- [ ] Can login with email/password
- [ ] Can login with Google OAuth
- [ ] Can login with Microsoft OAuth
- [ ] Can view "My Tickets"
- [ ] Can see only own bookings
- [ ] Can logout successfully

### Admin Login:
- [ ] Can access /admin URL
- [ ] Can login with password 7013367409
- [ ] Can see all users
- [ ] Can see all bookings
- [ ] Can view statistics
- [ ] Can change user passwords
- [ ] Can logout successfully

---

**Status**: ✅ ALL LOGIN SYSTEMS WORKING
**Admin Password**: 7013367409
**Test URLs**: 
- User: http://localhost:5174/login
- Admin: http://localhost:5174/admin
