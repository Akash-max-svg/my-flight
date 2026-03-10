# ✅ TEST CHECKLIST - Verify Everything Works

**Quick checklist to verify the date system is working correctly**

---

## 🚀 BEFORE YOU START

### 1. Clear Browser Cache
```
□ Press Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
□ Select "Cached images and files"
□ Click "Clear data"
□ Close browser completely
□ Reopen browser
```

### 2. Restart Backend Server
```bash
□ Stop current server (Ctrl+C)
□ cd backend
□ npm start
□ Wait for "Server running on port 5000"
```

### 3. Restart Frontend
```bash
□ Stop current dev server (Ctrl+C)
□ npm run dev
□ Wait for "Local: http://localhost:5174"
```

---

## 📋 TEST SCENARIO 1: New Booking

### Step 1: Search for Flight
```
□ Go to homepage
□ Select From: Mumbai
□ Select To: Delhi
□ Select Departure Date: [Pick a date 7 days from now]
□ Note the date you selected: _______________
□ Click "Search Flights"
```

### Step 2: Book Flight
```
□ Select any flight from results
□ Fill passenger details
□ Complete booking
□ Note booking confirmation
```

### Step 3: Check Ticket Display
```
□ Go to "My Tickets" section
□ Find your new booking
□ Look for "Flight Date:" label
□ Verify it shows: [The date you selected in Step 1]
□ It should NOT show today's date
```

**Expected Result:**
```
✅ Flight Date: [Your selected date from search]
❌ NOT: Booked: [Today's date]
```

---

## 📋 TEST SCENARIO 2: Cancellation Check

### Step 1: Try to Cancel (More than 3 days)
```
□ Go to "My Tickets"
□ Find a booking with flight >3 days away
□ Click "Cancel Ticket"
□ Check the dates shown:
  - Flight Date: _______________
  - Current Date: _______________
  - Days Until Flight: _______________
□ Should show: "✅ You can cancel this booking"
```

**Expected Result:**
```
✅ Can cancel (if >3 days before flight)
✅ Shows correct flight date
✅ Shows correct days calculation
```

### Step 2: Try to Cancel (Less than 3 days)
```
□ Find a booking with flight <3 days away
  (Or wait until 2 days before your test booking)
□ Click "Cancel Ticket"
□ Should show error message
□ Error should mention "3 days" and "72 hours"
```

**Expected Result:**
```
❌ Cannot cancel (if <3 days before flight)
❌ Shows error: "Cancellation not allowed..."
✅ Error mentions flight date
```

---

## 📋 TEST SCENARIO 3: Database Check

### Check MongoDB Data
```
□ Open MongoDB Compass or Atlas
□ Connect to your database
□ Find the bookings collection
□ Open your test booking
□ Verify these fields exist:
  - bookingDate: [Today's date]
  - travelDate: [Your selected flight date]
  - flight.departureDate: [Your selected flight date]
```

**Expected Result:**
```
✅ bookingDate = When you made the booking
✅ travelDate = Your selected departure date
✅ flight.departureDate = Your selected departure date
```

---

## 📋 TEST SCENARIO 4: Email Check

### If Email is Configured
```
□ Check your email inbox
□ Find booking confirmation email
□ Verify it shows:
  - Flight Date: [Your selected date]
  - NOT: Booking Date
□ Check cancellation policy mentions "3 days"
```

**Expected Result:**
```
✅ Email shows flight date
✅ Email mentions 3-day policy
✅ Download ticket link works
```

---

## 📋 TEST SCENARIO 5: Console Logs

### Check Backend Logs
```
□ Look at backend terminal
□ Find logs from your booking:
  "📅 Travel Date (Flight Departure): ..."
  "📅 Flight Departure Date: ..."
□ Verify both show your selected date
```

**Expected Result:**
```
✅ Travel Date matches your selection
✅ Flight Departure Date matches your selection
✅ No error messages
```

---

## ✅ VERIFICATION CHECKLIST

### All Tests Passed?

```
□ Test 1: Ticket shows flight date (not booking date)
□ Test 2: Cancellation uses flight date
□ Test 3: Database has correct dates
□ Test 4: Email shows flight date
□ Test 5: Console logs show correct dates
```

### If All Checked:
```
🎉 EVERYTHING IS WORKING CORRECTLY!
```

### If Any Failed:
```
⚠️ See troubleshooting section below
```

---

## 🔧 TROUBLESHOOTING

### Problem: Ticket shows booking date instead of flight date

**Check:**
```
1. Did you clear browser cache?
2. Did you restart backend server?
3. Is this an old booking? (Try creating new one)
4. Check browser console for errors (F12)
```

**Solution:**
```
1. Clear cache completely
2. Hard refresh (Ctrl+Shift+R)
3. Create new booking
4. Check VERIFICATION_COMPLETE_ALL_WORKING.md
```

---

### Problem: Cancellation not working

**Check:**
```
1. Is flight more than 3 days away?
2. Check backend logs for errors
3. Verify travelDate in database
```

**Solution:**
```
1. Verify date calculation in console
2. Check backend/models/Booking.model.js line 152
3. Restart backend server
```

---

### Problem: Date not saving to database

**Check:**
```
1. Backend server running?
2. MongoDB connected?
3. Check backend logs for errors
```

**Solution:**
```
1. Restart backend: cd backend && npm start
2. Check MongoDB connection in .env
3. Verify backend/routes/booking.routes.js line 40
```

---

## 📊 EXPECTED VS ACTUAL

### What You Should See:

```
SEARCH FORM:
Departure: March 15, 2026 ← You select this

TICKET DISPLAY:
Flight Date: March 15, 2026 ← Shows your selection ✅

CANCELLATION:
Flight Date: March 15, 2026 ← Uses your selection ✅
Current Date: March 10, 2026
Days Until Flight: 5 days
Result: ✅ Can cancel
```

### What You Should NOT See:

```
TICKET DISPLAY:
Booked: March 10, 2026 ← Wrong! ❌

CANCELLATION:
Booking Date: March 10, 2026 ← Wrong! ❌
```

---

## 🎯 QUICK TEST (30 seconds)

### Fastest Way to Verify:

```
1. Login
2. Go to "My Tickets"
3. Look at any ticket
4. Check the date label

Should say: "Flight Date: [date]" ✅
Should NOT say: "Booked: [date]" ❌
```

---

## 📞 RESULTS

### After Testing:

**If everything works:**
```
✅ System is correct
✅ No action needed
✅ Ready for production
```

**If something doesn't work:**
```
1. Check VERIFICATION_COMPLETE_ALL_WORKING.md
2. Check WHAT_YOU_WILL_SEE.md
3. Check COMPLETE_DATE_SOLUTION_FINAL.md
4. Verify code at line numbers mentioned
```

---

## 🎉 FINAL CHECK

### All Systems Go?

```
✅ Ticket shows flight date
✅ Cancellation uses flight date
✅ Database has correct dates
✅ No errors in console
✅ Backend logs correct
✅ Email shows correct date
```

**If all checked: You're good to go! 🚀**

---

**Date:** March 8, 2026  
**Status:** Ready for Testing  
**Time Required:** 5-10 minutes  
**Difficulty:** Easy
