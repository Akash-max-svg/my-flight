# 🚀 START HERE - Quick Access Guide

## ✅ Project is Running!

### 🌐 Access URLs
- **Frontend:** http://localhost:5174
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

---

## 🔐 Login Credentials

### User Login
- **URL:** http://localhost:5174/login
- **Create Account:** http://localhost:5174/signup
- **Method:** Email + Password

### Admin Login
- **URL:** http://localhost:5174/login → Click "🔐 Admin Login"
- **Password:** `7013367409`
- **Dashboard:** Automatically redirects after login

---

## 🎫 Features Access

### 1. My Tickets
**Location:** Home page → Click "🎫 My Tickets" button
**Shows:** All your flight bookings from database

### 2. User Dashboard
**Location:** Home page → Click "👤 User Logo" button
**Shows:** 
- User information
- Recent bookings
- Booking statistics
- Cancelled bookings

### 3. Book a Flight
**Location:** Home page → Click "🔍 Search" button
**Process:** Search → Select flight → Book → Confirm

### 4. Cancel Booking
**Location:** My Tickets → Click "❌ Cancel Ticket"
**Policy:** 48 hours before flight (2-day policy)
**Result:** Refund calculated, saved to database, email sent

---

## 📚 Documentation

### Complete Guides
1. **PERMANENT_SOLUTION_COMPLETE.md** - All fixes and solutions
2. **AUTH_STRUCTURE_DOCUMENTATION.md** - Authentication system
3. **COMPLETE_SYSTEM_TEST.md** - Testing guide
4. **WHERE_TO_FIND_EVERYTHING.md** - Visual navigation guide

### Quick References
- **QUICK_START_AUTH.md** - Authentication quick start
- **AUTH_FLOW_DIAGRAM.md** - Visual architecture
- **BACKEND_API_DOCUMENTATION.md** - API reference

---

## 🔧 If Something Goes Wrong

### Restart Servers
```powershell
# Frontend
npm run dev

# Backend
cd backend
npm start
```

### Clear Port Issues
```powershell
# Kill port 5000 (backend)
$port = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($port) { Stop-Process -Id $port -Force }

# Kill port 5173/5174 (frontend)
$port = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($port) { Stop-Process -Id $port -Force }
```

### Test Backend
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/health"
```

### Test Admin Login
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/admin-auth/login" -Method Post -ContentType "application/json" -Body '{"password":"7013367409"}'
```

---

## ✅ Everything Working

- ✅ User Login & Signup
- ✅ Admin Login (password: 7013367409)
- ✅ My Tickets (all bookings from MongoDB)
- ✅ User Dashboard (view all bookings)
- ✅ Booking Cancellation (saves to MongoDB)
- ✅ Cancelled Bookings Display

**All features are operational and ready to use!**

---

**Need Help?** Check the documentation files listed above.
