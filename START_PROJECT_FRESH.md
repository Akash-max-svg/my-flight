# 🚀 START PROJECT - FRESH RUN

**Complete guide to start your flight booking system**

---

## 📋 PRE-START CHECKLIST

### ✅ What's Been Fixed:
- ✅ Cancellation checks flight date (not booking date)
- ✅ Email includes ticket download link
- ✅ Professional HTML email templates
- ✅ 3-day cancellation policy enforced
- ✅ All dates display correctly

---

## 🚀 STARTING THE PROJECT

### Step 1: Start Backend Server

```bash
cd backend
npm start
```

**Expected Output:**
```
Server running on port 5000
MongoDB Connected: ...
✅ Backend ready
```

---

### Step 2: Start Frontend Server

```bash
# In a new terminal
npm run dev
```

**Expected Output:**
```
VITE ready in XXX ms
Local: http://localhost:5174
✅ Frontend ready
```

---

## 🌐 ACCESS THE APPLICATION

### URLs:
- **Frontend:** http://localhost:5174
- **Backend API:** http://localhost:5000
- **Admin Dashboard:** http://localhost:5174/admin

### Test Accounts:
- **Admin:** 
  - Phone: 7013367409
  - Password: 7013367409

---

## ✅ WHAT'S WORKING NOW

### 1. Booking System
- ✅ Search flights
- ✅ Book tickets
- ✅ View bookings
- ✅ Download tickets
- ✅ Email confirmation with download link

### 2. Cancellation System
- ✅ Cancel bookings (>3 days before flight)
- ✅ Correct date checking (flight date, not booking date)
- ✅ Clear error messages
- ✅ Refund calculation
- ✅ Email notification

### 3. Email System
- ✅ Professional HTML templates
- ✅ Ticket download button
- ✅ Flight date displayed correctly
- ✅ Complete booking details
- ✅ Cancellation emails

---

## 🔧 IF YOU ENCOUNTER ISSUES

### Backend Won't Start:
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill process if needed
taskkill /PID <PID> /F

# Restart
cd backend
npm start
```

### Frontend Won't Start:
```bash
# Check if port 5174 is in use
netstat -ano | findstr :5174

# Kill process if needed
taskkill /PID <PID> /F

# Restart
npm run dev
```

### MongoDB Connection Error:
```
Check backend/.env file:
- MONGODB_URI is correct
- Your IP is whitelisted in MongoDB Atlas
```

---

## 📧 EMAIL CONFIGURATION (Optional)

To enable email notifications:

```bash
# Edit backend/.env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
BACKEND_URL=http://localhost:5000
```

Get Gmail App Password:
https://myaccount.google.com/apppasswords

---

## 🎯 QUICK TEST

### Test Booking:
1. Go to http://localhost:5174
2. Search for a flight
3. Book a ticket
4. Check "My Tickets"
5. Verify flight date is correct

### Test Cancellation:
1. Go to "My Tickets"
2. Click "Cancel" on a booking
3. Verify it checks flight date correctly
4. If >3 days: Can cancel
5. If <3 days: Shows error with time

### Test Email (if configured):
1. Create a booking
2. Check your email
3. Verify download link is present
4. Click download button
5. PDF should download

---

## ✅ ALL SYSTEMS GO!

Your project is ready to use with all fixes applied!
