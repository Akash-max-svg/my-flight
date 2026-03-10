# 🧪 TEST ALL FEATURES NOW - QUICK GUIDE

## ✅ VERIFICATION COMPLETE - NOW TEST MANUALLY

All code has been checked and verified with **0 errors**. Follow this guide to test the features.

---

## 🚀 START THE APPLICATION

### Step 1: Start Backend
```bash
cd backend
npm start
```

**Expected Output:**
```
✅ Server running on port 5000
✅ MongoDB connected successfully
✅ CORS enabled for ports 5173 and 5174
```

### Step 2: Start Frontend (New Terminal)
```bash
npm run dev
```

**Expected Output:**
```
✅ Local: http://localhost:5174
✅ Ready in X ms
```

---

## 🧪 TEST CHECKLIST

### 1. ✅ User Login/Signup
```
URL: http://localhost:5174/login

Test:
1. Click "Sign Up"
2. Create new account
3. Login with credentials
4. Should redirect to home page

Expected: ✅ Login successful
```

### 2. ✅ View My Tickets
```
URL: http://localhost:5174/home

Test:
1. Click "🎫 My Tickets" button
2. Should see your bookings
3. Each booking shows "Cancel Ticket" button

Expected: ✅ Bookings displayed
```

### 3. ✅ Cancel Ticket (>3 Days Before Flight)
```
Test:
1. Find a booking with flight >3 days away
2. Click "❌ Cancel Ticket"
3. Should navigate to cancellation wizard

Step 1 - Select Reason:
- Choose a reason (e.g., "Change of Plans")
- Click "Continue →"

Step 2 - Refund Method:
- See refund calculation
- Choose refund method
- Click "Continue →"

Step 3 - Confirmation:
- Review summary
- Check "I accept terms"
- Click "Confirm Cancellation"

Step 4 - Success:
- See success message
- Refund amount displayed
- Email notification sent

Expected: ✅ Cancellation successful
```

### 4. ✅ Try to Cancel <3 Days Before Flight
```
Test:
1. Find booking with flight <3 days away
2. Click "Cancel Ticket"
3. Should see error message

Expected: ❌ "Cancellation not allowed. Must be >3 days before flight"
```

### 5. ✅ View Cancelled Bookings
```
Test:
1. Click "❌ Cancelled (X)" button
2. Should see cancelled bookings section
3. Shows cancellation details:
   - Cancellation date
   - Refund amount
   - Refund status
   - Cancellation reason

Expected: ✅ Cancelled bookings displayed
```

### 6. ✅ Check Dashboard Statistics
```
URL: http://localhost:5174/booking-dashboard

Test:
1. Navigate to dashboard
2. Should see:
   - Total bookings
   - Total cancellations
   - Refund amounts
   - Recent activity

Expected: ✅ Statistics displayed correctly
```

### 7. ✅ Email Notifications (If Configured)
```
Test:
1. Book a flight
2. Check email for confirmation
3. Cancel the booking
4. Check email for cancellation notice

Expected: ✅ Emails received (if email configured)
```

### 8. ✅ Admin Login
```
URL: http://localhost:5174/admin-login

Test:
1. Login with admin credentials
   - Email: admin@akgroup.com
   - Password: 7013367409
2. Should see admin dashboard
3. View all bookings and cancellations

Expected: ✅ Admin access working
```

---

## 🔍 DETAILED FEATURE TESTS

### Test 1: 10-Day Guarantee
```
Scenario: Cancel within 10 days of booking

Steps:
1. Book a flight today
2. Cancel it within 10 days
3. Check refund amount

Expected: 100% refund (10-day guarantee)
```

### Test 2: 3-Day Policy Enforcement
```
Scenario: Try to cancel 2 days before flight

Steps:
1. Find booking with flight in 2 days
2. Try to cancel
3. Should be blocked

Expected: Error message about 3-day policy
```

### Test 3: Refund Calculation
```
Scenario: Test different refund percentages

Test Cases:
- Cancel 5 days after booking → 100% refund
- Cancel 20 days after booking → 75% refund
- Cancel 45 days after booking → 50% refund
- Cancel 70 days after booking → 25% refund

Expected: Correct refund percentages
```

### Test 4: MongoDB Data Persistence
```
Scenario: Verify data is saved

Steps:
1. Cancel a booking
2. Refresh the page
3. Check "Cancelled" section
4. Booking should still be there

Expected: Data persists after refresh
```

### Test 5: UI Updates
```
Scenario: Real-time UI updates

Steps:
1. Cancel a booking
2. UI should update automatically
3. Booking moves from "My Tickets" to "Cancelled"
4. Dashboard statistics update

Expected: Automatic UI refresh
```

---

## 🐛 TROUBLESHOOTING

### Issue 1: Backend Not Starting
```
Error: Port 5000 already in use

Solution:
1. Kill process on port 5000
2. Or change port in backend/.env
```

### Issue 2: Frontend Not Loading
```
Error: Cannot connect to backend

Solution:
1. Verify backend is running
2. Check CORS configuration
3. Verify API URL in frontend
```

### Issue 3: MongoDB Connection Error
```
Error: MongoServerError

Solution:
1. Check MongoDB Atlas IP whitelist
2. Verify connection string
3. Check network connection
```

### Issue 4: Email Not Sending
```
Error: Email not configured

Solution:
1. Add email credentials to backend/.env
2. EMAIL_USER=your-email@gmail.com
3. EMAIL_PASSWORD=your-app-password
4. Restart backend
```

### Issue 5: Cancellation Blocked
```
Error: "Cancellation not allowed"

Reason: Flight is <3 days away

Solution: This is expected behavior (3-day policy)
```

---

## ✅ VERIFICATION CHECKLIST

After testing, verify:

### Frontend:
- [ ] Login/signup works
- [ ] My Tickets displays
- [ ] Cancel button appears
- [ ] Cancellation wizard works
- [ ] Cancelled section displays
- [ ] Dashboard shows statistics
- [ ] UI updates automatically

### Backend:
- [ ] Server starts without errors
- [ ] MongoDB connects
- [ ] API endpoints respond
- [ ] Cancellation processes
- [ ] Data saves to database
- [ ] Email sends (if configured)

### Features:
- [ ] 3-day policy enforced
- [ ] Refund calculated correctly
- [ ] 10-day guarantee works
- [ ] Email notifications sent
- [ ] MongoDB data persists
- [ ] UI updates in real-time

---

## 📊 EXPECTED RESULTS

### All Tests Should Show:
```
✅ User authentication working
✅ Booking display working
✅ Cancellation flow working
✅ 3-day policy enforced
✅ Refund calculation correct
✅ Email notifications sent
✅ MongoDB integration working
✅ UI updates automatically
✅ Dashboard statistics accurate
✅ Admin access working
```

---

## 🎉 SUCCESS CRITERIA

**All features working if:**
1. ✅ Can login/signup
2. ✅ Can view bookings
3. ✅ Can cancel bookings (>3 days)
4. ✅ Cannot cancel (<3 days)
5. ✅ Refund calculated correctly
6. ✅ Email sent (if configured)
7. ✅ Data saved to MongoDB
8. ✅ UI updates automatically
9. ✅ Dashboard shows statistics
10. ✅ No console errors

---

## 📞 SUPPORT

If any test fails:
1. Check console for errors
2. Review error messages
3. Check documentation files
4. Verify environment variables
5. Contact: support@akgroup.com

---

## 📚 DOCUMENTATION REFERENCE

For detailed information:
- `TICKET_CANCELLATION_SIMPLE_GUIDE.md` - How to cancel
- `HOW_TO_CANCEL_TICKET_GUIDE.md` - Complete guide
- `CANCELLATION_FLOW_DIAGRAM.md` - Technical flow
- `FEATURE_VERIFICATION_COMPLETE.md` - Verification results

---

**Testing Date:** March 8, 2026  
**Status:** ✅ Ready for Testing  
**Code Status:** ✅ 0 Errors Found

**🚀 START TESTING NOW! 🚀**
