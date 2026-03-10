# 🔄 Authentication Flow Diagram

## User Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER AUTHENTICATION                       │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   Browser    │
│  (Login.jsx) │
└──────┬───────┘
       │
       │ userAuthService.login()
       ↓
┌──────────────────────┐
│  userAuthService.js  │
│  (Frontend Service)  │
└──────┬───────────────┘
       │
       │ POST /api/auth/login
       ↓
┌──────────────────────┐
│   auth.routes.js     │
│  (Backend Routes)    │
└──────┬───────────────┘
       │
       │ login()
       ↓
┌─────────────────────────┐
│ user-auth.controller.js │
│  (Business Logic)       │
└──────┬──────────────────┘
       │
       │ 1. Validate credentials
       │ 2. Generate JWT token
       │ 3. Update last login
       ↓
┌──────────────────────┐
│   User.model.js      │
│   (MongoDB)          │
└──────┬───────────────┘
       │
       │ Return user + token
       ↓
┌──────────────────────┐
│  userAuthService.js  │
│  Store in localStorage│
└──────┬───────────────┘
       │
       │ Navigate to /home
       ↓
┌──────────────┐
│   Home.jsx   │
│ (User logged │
│     in)      │
└──────────────┘
```

---

## Admin Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                       ADMIN AUTHENTICATION                       │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   Browser    │
│  (Login.jsx) │
└──────┬───────┘
       │
       │ adminAuthService.login()
       ↓
┌──────────────────────┐
│ adminAuthService.js  │
│  (Frontend Service)  │
└──────┬───────────────┘
       │
       │ POST /api/admin-auth/login
       ↓
┌──────────────────────┐
│ admin-auth.routes.js │
│  (Backend Routes)    │
└──────┬───────────────┘
       │
       │ adminLogin()
       ↓
┌──────────────────────────┐
│ admin-auth.controller.js │
│  (Business Logic)        │
└──────┬───────────────────┘
       │
       │ 1. Validate password
       │ 2. Generate session token
       │ 3. Track IP & user agent
       │ 4. Log login history
       ↓
┌──────────────────────┐
│   Admin.model.js     │
│   (MongoDB)          │
└──────┬───────────────┘
       │
       │ Return admin + session token
       ↓
┌──────────────────────┐
│ adminAuthService.js  │
│ Store in sessionStorage│
└──────┬───────────────┘
       │
       │ Navigate to /admin-dashboard
       ↓
┌──────────────────┐
│ AdminDashboard   │
│ (Admin logged    │
│      in)         │
└──────────────────┘
```

---

## File Organization

```
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND STRUCTURE                        │
└─────────────────────────────────────────────────────────────────┘

backend/
│
├── controllers/                    ← Business Logic Layer
│   ├── user-auth.controller.js    ← User authentication logic
│   │   ├── register()
│   │   ├── login()
│   │   ├── getMe()
│   │   ├── updateProfile()
│   │   └── logout()
│   │
│   └── admin-auth.controller.js   ← Admin authentication logic
│       ├── adminLogin()
│       ├── validateSession()
│       ├── adminLogout()
│       ├── getAdminInfo()
│       ├── getLoginHistory()
│       └── getActiveSessions()
│
├── routes/                         ← API Endpoints Layer
│   ├── auth.routes.js             ← User auth endpoints
│   │   └── /api/auth/*
│   │
│   ├── admin-auth.routes.js       ← Admin auth endpoints
│   │   └── /api/admin-auth/*
│   │
│   └── admin.routes.js            ← Admin data endpoints
│       └── /api/admin/*
│
├── models/                         ← Database Layer
│   ├── User.model.js              ← User schema
│   └── Admin.model.js             ← Admin schema
│
└── server.js                       ← Application Entry Point
    └── Route Registration


┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND STRUCTURE                        │
└─────────────────────────────────────────────────────────────────┘

src/
│
├── services/                       ← API Communication Layer
│   ├── userAuthService.js         ← User auth service
│   │   ├── register()
│   │   ├── login()
│   │   ├── getMe()
│   │   ├── updateProfile()
│   │   ├── logout()
│   │   └── isLoggedIn()
│   │   └── Storage: localStorage
│   │
│   └── adminAuthService.js        ← Admin auth service
│       ├── login()
│       ├── validateSession()
│       ├── logout()
│       ├── getAdminInfo()
│       ├── getLoginHistory()
│       ├── getActiveSessions()
│       └── isLoggedIn()
│       └── Storage: sessionStorage
│
└── Components/                     ← UI Layer
    ├── Login.jsx                  ← Login page
    │   ├── User login form
    │   └── Admin login toggle
    │
    ├── Signup.jsx                 ← Signup page
    │   └── User registration form
    │
    └── AdminDashboard.jsx         ← Admin dashboard
        └── Admin data management
```

---

## Data Flow Comparison

### User Authentication
```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Browser   │────▶│ userAuthSvc  │────▶│ /api/auth/* │
│             │     │              │     │             │
│ localStorage│◀────│ JWT Token    │◀────│ Controller  │
└─────────────┘     └──────────────┘     └─────────────┘
     │                                           │
     │                                           ↓
     │                                    ┌─────────────┐
     └───────────────────────────────────▶│ User Model  │
                                          └─────────────┘
```

### Admin Authentication
```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│   Browser    │────▶│ adminAuthSvc │────▶│ /api/admin-auth/*│
│              │     │              │     │                  │
│sessionStorage│◀────│Session Token │◀────│   Controller     │
└──────────────┘     └──────────────┘     └──────────────────┘
     │                                            │
     │                                            ↓
     │                                     ┌─────────────┐
     └─────────────────────────────────────▶│ Admin Model │
                                           └─────────────┘
```

---

## Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                         SECURITY LAYERS                          │
└─────────────────────────────────────────────────────────────────┘

User Authentication:
┌────────────────────────────────────────────────────────────┐
│ Layer 1: Password Hashing (bcrypt)                         │
│ Layer 2: JWT Token Validation                              │
│ Layer 3: Token Expiration (30 days)                        │
│ Layer 4: Protected Routes Middleware                       │
│ Layer 5: CORS Configuration                                │
└────────────────────────────────────────────────────────────┘

Admin Authentication:
┌────────────────────────────────────────────────────────────┐
│ Layer 1: Password Hashing (bcrypt)                         │
│ Layer 2: Session Token Validation                          │
│ Layer 3: Session Expiration (24 hours)                     │
│ Layer 4: IP Address Tracking                               │
│ Layer 5: User Agent Logging                                │
│ Layer 6: Login History Tracking                            │
│ Layer 7: Multiple Session Management                       │
│ Layer 8: Auto Session Cleanup                              │
│ Layer 9: CORS Configuration                                │
└────────────────────────────────────────────────────────────┘
```

---

## API Endpoint Map

```
┌─────────────────────────────────────────────────────────────────┐
│                         API ENDPOINTS                            │
└─────────────────────────────────────────────────────────────────┘

User Endpoints:
/api/auth/
├── POST   /register          → user-auth.controller.register()
├── POST   /login             → user-auth.controller.login()
├── GET    /me                → user-auth.controller.getMe()
├── PUT    /update            → user-auth.controller.updateProfile()
└── POST   /logout            → user-auth.controller.logout()

Admin Endpoints:
/api/admin-auth/
├── POST   /login             → admin-auth.controller.adminLogin()
├── POST   /validate-session  → admin-auth.controller.validateSession()
├── POST   /logout            → admin-auth.controller.adminLogout()
├── GET    /me                → admin-auth.controller.getAdminInfo()
├── GET    /login-history     → admin-auth.controller.getLoginHistory()
└── GET    /sessions          → admin-auth.controller.getActiveSessions()

Admin Data:
/api/admin/
├── GET    /users             → Get all users
├── GET    /bookings          → Get all bookings
├── GET    /stats             → Get statistics
└── PUT    /users/:id/change-password → Change user password
```

---

## Storage Comparison

```
┌─────────────────────────────────────────────────────────────────┐
│                      STORAGE MECHANISMS                          │
└─────────────────────────────────────────────────────────────────┘

User Authentication (localStorage):
┌────────────────────────────────────────────────────────────┐
│ Key: "user"                                                 │
│ Value: {                                                    │
│   _id: "...",                                               │
│   username: "...",                                          │
│   email: "...",                                             │
│   token: "JWT_TOKEN",                                       │
│   refreshToken: "REFRESH_TOKEN"                             │
│ }                                                           │
│                                                             │
│ Persistence: Survives browser close                        │
│ Expiry: 30 days (token expiry)                             │
└────────────────────────────────────────────────────────────┘

Admin Authentication (sessionStorage):
┌────────────────────────────────────────────────────────────┐
│ Key: "adminSessionToken"                                    │
│ Value: "SESSION_TOKEN_UUID"                                 │
│                                                             │
│ Key: "adminData"                                            │
│ Value: {                                                    │
│   username: "admin",                                        │
│   email: "admin@flightbooking.com",                         │
│   role: "superadmin",                                       │
│   permissions: [...]                                        │
│ }                                                           │
│                                                             │
│ Persistence: Cleared on browser close                      │
│ Expiry: 24 hours (session expiry)                          │
└────────────────────────────────────────────────────────────┘
```

---

## Benefits Visualization

```
┌─────────────────────────────────────────────────────────────────┐
│                    BEFORE vs AFTER                               │
└─────────────────────────────────────────────────────────────────┘

BEFORE (Mixed Authentication):
┌────────────────────────────────────────────────────────────┐
│ auth.controller.js                                          │
│ ├── User login                                              │
│ ├── Admin login                                             │
│ ├── User register                                           │
│ ├── Admin session                                           │
│ └── Mixed logic ❌                                          │
│                                                             │
│ Problems:                                                   │
│ ❌ Hard to maintain                                         │
│ ❌ Security concerns                                        │
│ ❌ Difficult to debug                                       │
│ ❌ Fetch errors                                             │
└────────────────────────────────────────────────────────────┘

AFTER (Separated Authentication):
┌────────────────────────────────────────────────────────────┐
│ user-auth.controller.js     │  admin-auth.controller.js    │
│ ├── User login              │  ├── Admin login             │
│ ├── User register           │  ├── Session validation      │
│ ├── User profile            │  ├── Login history           │
│ └── User logout             │  └── Session management      │
│                             │                              │
│ Benefits:                                                   │
│ ✅ Easy to maintain                                         │
│ ✅ Better security                                          │
│ ✅ Easy to debug                                            │
│ ✅ No fetch errors                                          │
│ ✅ Clear separation                                         │
│ ✅ Scalable                                                 │
└────────────────────────────────────────────────────────────┘
```

---

**This diagram shows the complete authentication architecture!** 🎯
