# Authentication Structure Documentation

## Overview
The authentication system has been completely reorganized to separate user and admin authentication into dedicated files and APIs for better maintainability and security.

---

## Backend Structure

### Controllers (Business Logic)

#### 1. User Authentication Controller
**File:** `backend/controllers/user-auth.controller.js`

**Functions:**
- `register()` - Register new user
- `login()` - User login with JWT tokens
- `getMe()` - Get current user info
- `updateProfile()` - Update user profile
- `logout()` - User logout

**Features:**
- JWT token generation
- Password hashing and validation
- Welcome email on registration
- Profile management

---

#### 2. Admin Authentication Controller
**File:** `backend/controllers/admin-auth.controller.js`

**Functions:**
- `adminLogin()` - Admin login with session tokens
- `validateSession()` - Validate admin session
- `adminLogout()` - Admin logout
- `getAdminInfo()` - Get admin information
- `getLoginHistory()` - Get admin login history
- `getActiveSessions()` - Get active admin sessions

**Features:**
- Session-based authentication
- IP tracking and user agent logging
- Login history tracking
- Multiple session management
- Auto-create default admin if not exists

---

### Routes (API Endpoints)

#### 1. User Authentication Routes
**File:** `backend/routes/auth.routes.js`
**Base URL:** `/api/auth`

**Endpoints:**
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - User login
GET    /api/auth/me            - Get current user (protected)
PUT    /api/auth/update        - Update profile (protected)
POST   /api/auth/logout        - User logout (protected)
```

---

#### 2. Admin Authentication Routes
**File:** `backend/routes/admin-auth.routes.js`
**Base URL:** `/api/admin-auth`

**Endpoints:**
```
POST   /api/admin-auth/login            - Admin login
POST   /api/admin-auth/validate-session - Validate admin session
POST   /api/admin-auth/logout           - Admin logout
GET    /api/admin-auth/me               - Get admin info
GET    /api/admin-auth/login-history    - Get login history
GET    /api/admin-auth/sessions         - Get active sessions
```

---

#### 3. Admin Data Management Routes
**File:** `backend/routes/admin.routes.js`
**Base URL:** `/api/admin`

**Endpoints:**
```
GET    /api/admin/users                        - Get all users
GET    /api/admin/bookings                     - Get all bookings
GET    /api/admin/stats                        - Get statistics
PUT    /api/admin/users/:id/change-password    - Change user password
```

---

## Frontend Structure

### Services (API Communication)

#### 1. User Authentication Service
**File:** `src/services/userAuthService.js`

**Methods:**
- `register(userData)` - Register new user
- `login(credentials)` - User login
- `getMe()` - Get current user
- `updateProfile(updates)` - Update profile
- `logout()` - User logout
- `isLoggedIn()` - Check if user is logged in

**Storage:** Uses `localStorage` for user data and JWT tokens

**Usage Example:**
```javascript
import userAuthService from '../services/userAuthService';

// Login
const response = await userAuthService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Check if logged in
if (userAuthService.isLoggedIn()) {
  // User is authenticated
}

// Logout
await userAuthService.logout();
```

---

#### 2. Admin Authentication Service
**File:** `src/services/adminAuthService.js`

**Methods:**
- `login(password)` - Admin login
- `validateSession()` - Validate admin session
- `logout()` - Admin logout
- `getAdminInfo()` - Get admin information
- `getLoginHistory()` - Get login history
- `getActiveSessions()` - Get active sessions
- `isLoggedIn()` - Check if admin is logged in

**Storage:** Uses `sessionStorage` for admin session tokens (more secure)

**Usage Example:**
```javascript
import adminAuthService from '../services/adminAuthService';

// Login
const response = await adminAuthService.login('7013367409');

// Check if logged in
if (adminAuthService.isLoggedIn()) {
  // Admin is authenticated
}

// Logout
await adminAuthService.logout();
```

---

### Components

#### 1. Login Component
**File:** `src/Components/Login.jsx`

**Features:**
- User login form
- OAuth login buttons (Google, Microsoft, Instagram)
- Admin login toggle
- Separate admin login box
- Uses `userAuthService` for user login
- Uses `adminAuthService` for admin login

---

#### 2. Signup Component
**File:** `src/Components/Signup.jsx`

**Features:**
- User registration form
- Form validation
- Uses `userAuthService` for registration

---

#### 3. Admin Dashboard Component
**File:** `src/Components/AdminDashboard.jsx`

**Features:**
- Admin login modal
- Session validation on load
- Uses `adminAuthService` for authentication
- Uses `apiService` for data management

---

## Key Differences

### User Authentication
- **Storage:** localStorage
- **Token Type:** JWT (JSON Web Tokens)
- **Expiry:** 30 days (configurable)
- **Use Case:** Regular users booking flights
- **Routes:** `/api/auth/*`

### Admin Authentication
- **Storage:** sessionStorage (cleared on browser close)
- **Token Type:** Session tokens (UUID)
- **Expiry:** 24 hours (configurable)
- **Use Case:** Admin dashboard access
- **Routes:** `/api/admin-auth/*`
- **Security:** IP tracking, login history, multiple session management

---

## Security Features

### User Authentication
✅ Password hashing with bcrypt
✅ JWT token validation
✅ Protected routes with middleware
✅ Email verification on registration
✅ Password strength validation

### Admin Authentication
✅ Session-based authentication
✅ IP address tracking
✅ User agent logging
✅ Login history tracking
✅ Session expiration
✅ Multiple session management
✅ Auto-cleanup of expired sessions

---

## Migration Guide

### For User Login/Signup
**Old:**
```javascript
import apiService from '../services/api';
await apiService.login(credentials);
```

**New:**
```javascript
import userAuthService from '../services/userAuthService';
await userAuthService.login(credentials);
```

### For Admin Login
**Old:**
```javascript
import apiService from '../services/api';
await apiService.adminLogin(password);
```

**New:**
```javascript
import adminAuthService from '../services/adminAuthService';
await adminAuthService.login(password);
```

---

## File Structure

```
backend/
├── controllers/
│   ├── user-auth.controller.js    ✨ NEW - User authentication logic
│   ├── admin-auth.controller.js   ✨ NEW - Admin authentication logic
│   └── auth.controller.js         ⚠️  DEPRECATED - Use user-auth.controller.js
├── routes/
│   ├── auth.routes.js             ✅ UPDATED - User auth routes
│   ├── admin-auth.routes.js       ✅ UPDATED - Admin auth routes
│   └── admin.routes.js            ✅ Admin data management routes
└── server.js                      ✅ UPDATED - Route registration

frontend/
├── services/
│   ├── userAuthService.js         ✨ NEW - User authentication service
│   ├── adminAuthService.js        ✨ NEW - Admin authentication service
│   └── api.js                     ⚠️  DEPRECATED for auth - Use dedicated services
└── Components/
    ├── Login.jsx                  ✅ UPDATED - Uses new services
    ├── Signup.jsx                 ✅ UPDATED - Uses new services
    └── AdminDashboard.jsx         ✅ UPDATED - Uses new services
```

---

## Testing

### Test User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Test Admin Login
```bash
curl -X POST http://localhost:5000/api/admin-auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"7013367409"}'
```

---

## Benefits of New Structure

✅ **Separation of Concerns** - User and admin auth are completely separate
✅ **Better Security** - Different authentication mechanisms for different roles
✅ **Easier Maintenance** - Each file has a single responsibility
✅ **Scalability** - Easy to add new authentication methods
✅ **Clear API Structure** - Intuitive endpoint organization
✅ **Type Safety** - Dedicated services prevent mixing user/admin logic
✅ **Better Testing** - Each component can be tested independently

---

## Admin Credentials

**Username:** admin
**Password:** 7013367409
**Email:** admin@flightbooking.com

The admin account is automatically created on first login attempt if it doesn't exist.

---

## Next Steps

1. ✅ Backend controllers separated
2. ✅ Backend routes organized
3. ✅ Frontend services created
4. ✅ Components updated
5. ✅ Server.js configured
6. 🔄 Test all authentication flows
7. 🔄 Update any remaining components using old API

---

## Support

If you encounter any issues with the new authentication structure:
1. Check the console for detailed error logs
2. Verify the backend server is running on port 5000
3. Verify the frontend is running on port 5174
4. Check MongoDB connection
5. Review this documentation for correct usage

---

**Last Updated:** March 8, 2026
**Version:** 2.0.0
