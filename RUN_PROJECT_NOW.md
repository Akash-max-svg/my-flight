# 🚀 Run Project - Complete Guide

## ✅ All Recent Fixes Included

This project now includes:
- ✅ Cancelled bookings system (separate from active tickets)
- ✅ User account dropdown with MongoDB data
- ✅ 3-day cancellation policy
- ✅ Admin dashboard with cancelled bookings tab
- ✅ Complete user profile display
- ✅ All authentication features

---

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ Node.js (v16 or higher)
- ✅ MongoDB Atlas account (or local MongoDB)
- ✅ Git (optional)

---

## 🎯 Step-by-Step Instructions

### Step 1: Open Two Terminals

You'll need **TWO separate terminal windows**:
- Terminal 1: For Backend
- Terminal 2: For Frontend

---

### Step 2: Start Backend Server

**In Terminal 1:**

```bash
# Navigate to backend folder
cd backend

# Install dependencies (if not already installed)
npm install

# Start the backend server
npm start
```

**Expected Output:**
```
🚀 Server running on port 5000
✅ MongoDB Connected: <your-cluster-name>
```

**If you see errors:**
- Check MongoDB connection string in `backend/.env`
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify `.env` file exists with correct credentials

---

### Step 3: Start Frontend Application

**In Terminal 2 (NEW WINDOW):**

```bash
# Make sure you're in the project root
# (NOT in the backend folder)

# Install dependencies (if not already installed)
npm install

# Start the frontend development server
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

---

### Step 4: Open in Browser

1. Open your browser
2. Go to: **http://localhost:5173**
3. You should see the flight booking homepage

---

## 🧪 Test the Application

### Test 1: User Registration & Login

1. Click **"Sign Up"** or **"Get Started"**
2. Fill in the registration form:
   - Username
   - Email
   - Password
   - Age
   - Gender
   - Mobile (10 digits)
   - Country
   - Date of Birth
3. Click **"Create Account"**
4. You'll be logged in automatically

### Test 2: User Account Dropdown

1. Look for the **purple circle button** in the top-right corner
2. Click it
3. You should see a dropdown with:
   - Your username and email
   - Complete profile details (age, mobile, gender, country, DOB)
   - Active bookings count
   - Total spent
   - Edit Profile button
   - Logout button

**Check Browser Console (F12):**
```
🖱️ Account button clicked
📊 Current showDashboard: false
👤 User data: {...}
🔄 Fetching fresh user profile from backend...
✅ Fresh user data received from MongoDB: {...}
💾 ✅ Updated localStorage and state with fresh MongoDB data
```

### Test 3: Book a Flight

1. Search for flights (e.g., Delhi to Mumbai)
2. Select a flight
3. Fill passenger details
4. Select seats (optional)
5. Select meals (optional)
6. Complete payment
7. View booking confirmation

### Test 4: View My Tickets

1. Click **"My Tickets"** button in navigation
2. You should see your active bookings
3. Each ticket shows:
   - Flight details
   - Passenger info
   - Download button
   - Email button
   - Cancel button

### Test 5: Cancel a Ticket

1. Go to "My Tickets"
2. Click **"Cancel"** on a booking
3. You'll be redirected to cancellation page
4. Review cancellation details:
   - Flight information
   - Refund amount
   - Cancellation policy
5. Select cancellation reason
6. Click **"Confirm Cancellation"**
7. Ticket is cancelled and moved to "Cancelled" section

### Test 6: View Cancelled Tickets

1. Click **"Cancelled"** button in navigation
2. You should see all your cancelled bookings
3. Each cancelled ticket shows:
   - Flight details
   - Cancellation date
   - Refund amount
   - Refund status
   - Cancellation reason

### Test 7: Admin Dashboard

1. Navigate to: **http://localhost:5173/admin**
2. Enter admin password: **7013367409**
3. View admin dashboard with three tabs:
   - **Users**: All registered users
   - **All Bookings**: All bookings (including cancelled)
   - **Cancelled**: Only cancelled bookings

---

## 🔍 Troubleshooting

### Issue: Backend won't start

**Check:**
```bash
# In backend folder
cat .env
# Should show MongoDB connection string
```

**Solution:**
1. Ensure `.env` file exists in `backend/` folder
2. Check MongoDB connection string is correct
3. Verify your IP is whitelisted in MongoDB Atlas

### Issue: Frontend won't start

**Check:**
```bash
# In project root
npm list vite
# Should show vite version
```

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: "Cannot connect to backend"

**Check:**
1. Backend is running on port 5000
2. Frontend is running on port 5173
3. No CORS errors in browser console

**Solution:**
```bash
# Restart both servers
# Terminal 1 (Backend):
cd backend
npm start

# Terminal 2 (Frontend):
npm run dev
```

### Issue: User account dropdown not showing

**Check Browser Console (F12):**
```javascript
// Check if user is logged in
localStorage.getItem('isLoggedIn')
// Should return: "true"

// Check user data
JSON.parse(localStorage.getItem('user'))
// Should show user object with all fields
```

**Solution:**
1. Logout and login again
2. Clear browser cache (Ctrl+Shift+Delete)
3. Check console for errors
4. Verify backend `/api/user-auth/me` endpoint works

### Issue: Cancelled tickets not showing

**Check:**
1. Backend route order is correct (cancelled routes before :id)
2. MongoDB has cancelled bookings
3. User is logged in

**Solution:**
```bash
# Check MongoDB directly
# In MongoDB Atlas, go to Collections
# Find bookings with status: "cancelled"
```

---

## 📊 Port Configuration

| Service | Port | URL |
|---------|------|-----|
| Backend | 5000 | http://localhost:5000 |
| Frontend | 5173 | http://localhost:5173 |
| MongoDB | 27017 | (Atlas cloud) |

---

## 🔐 Default Credentials

### Admin Access:
- **URL**: http://localhost:5173/admin
- **Password**: 7013367409

### Test User (if you created one):
- **Email**: Your registered email
- **Password**: Your password

---

## 📝 Important Notes

1. **Keep both terminals running** - Don't close them
2. **Backend must start first** - Always start backend before frontend
3. **MongoDB connection** - Ensure MongoDB Atlas is accessible
4. **Browser console** - Keep F12 open to see logs
5. **Clear cache** - If issues persist, clear browser cache

---

## 🎉 Success Indicators

You'll know everything is working when:

✅ **Backend Terminal shows:**
```
🚀 Server running on port 5000
✅ MongoDB Connected
```

✅ **Frontend Terminal shows:**
```
➜  Local:   http://localhost:5173/
```

✅ **Browser shows:**
- Homepage with flight search
- Login/Signup buttons
- No console errors

✅ **After Login:**
- Purple account button in top-right
- Account dropdown shows all your details
- My Tickets shows your bookings
- Cancelled section shows cancelled tickets

---

## 🚨 Quick Commands Reference

### Start Everything:

**Terminal 1 (Backend):**
```bash
cd backend && npm start
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

### Stop Everything:

Press **Ctrl+C** in both terminals

### Restart Everything:

1. Stop both servers (Ctrl+C)
2. Start backend first
3. Then start frontend

---

## 📞 Need Help?

If you encounter issues:

1. **Check console logs** in both terminals
2. **Check browser console** (F12)
3. **Verify MongoDB connection** in Atlas
4. **Clear browser cache** and try again
5. **Restart both servers** fresh

---

## ✨ Features to Test

After starting the project, test these features:

1. ✅ User Registration & Login
2. ✅ User Account Dropdown (with MongoDB data)
3. ✅ Flight Search & Booking
4. ✅ Seat Selection
5. ✅ Meal Selection
6. ✅ Payment Processing
7. ✅ Booking Confirmation
8. ✅ My Tickets (Active bookings only)
9. ✅ Ticket Cancellation (3-day policy)
10. ✅ Cancelled Tickets (Separate section)
11. ✅ Admin Dashboard (All data)
12. ✅ Admin Cancelled Tab
13. ✅ Profile Edit
14. ✅ Password Reset

---

## 🎯 Ready to Start!

Follow the steps above and your project will be running with all the latest fixes!

**Remember:**
- Backend first (Terminal 1)
- Frontend second (Terminal 2)
- Open http://localhost:5173 in browser
- Check console for any errors

**Happy Testing! 🚀**
