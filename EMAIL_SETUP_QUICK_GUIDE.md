# 📧 EMAIL SETUP - QUICK GUIDE

**Get your ticket download emails working in 5 minutes!**

---

## 🚀 QUICK SETUP (3 Steps)

### Step 1: Get Gmail App Password

```
1. Go to: https://myaccount.google.com/apppasswords
2. Sign in to your Gmail account
3. Click "Select app" → Choose "Mail"
4. Click "Select device" → Choose "Other"
5. Type: "Flight Booking System"
6. Click "Generate"
7. Copy the 16-character password (e.g., "abcd efgh ijkl mnop")
```

---

### Step 2: Update .env File

```bash
# Open backend/.env file and add:

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop    # ← Your app password (no spaces)
BACKEND_URL=http://localhost:5000
```

**Example:**
```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=john.doe@gmail.com
EMAIL_PASSWORD=xyzw1234abcd5678
BACKEND_URL=http://localhost:5000
```

---

### Step 3: Restart Backend

```bash
cd backend
npm start
```

**That's it! Emails will now be sent automatically!** ✅

---

## 📧 WHAT HAPPENS NOW

### When User Books a Flight:

```
1. User completes booking
   ↓
2. System sends confirmation email
   ↓
3. Email includes:
   • Booking details
   • Flight date (selected departure date)
   • Passenger information
   • Payment summary
   • 📥 Download Ticket button
   ↓
4. User clicks download button
   ↓
5. PDF ticket downloads automatically
```

---

## ✅ TEST IT NOW

### Quick Test:

```
1. Login to your application
2. Search for a flight
3. Complete a booking
4. Check your email inbox
5. Click "Download Your E-Ticket" button
6. Verify PDF downloads
```

---

## 📧 EMAIL PREVIEW

### What Users Will See:

```
From: Flight Booking System <your-email@gmail.com>
To: user@example.com
Subject: ✈️ Booking Confirmed - BK1710234567890

┌─────────────────────────────────────────┐
│  ✈️ Booking Confirmed!                  │
│  Your flight is booked and ready        │
├─────────────────────────────────────────┤
│                                         │
│  🎉 Success!                            │
│  Your booking has been confirmed        │
│                                         │
│  📋 Booking Details                     │
│  • Booking ID: BK1710234567890         │
│  • Confirmation Number: BF234567       │
│  • E-Ticket Number: ET987654321        │
│                                         │
│  ✈️ Flight Information                  │
│  • Airline: Air India                  │
│  • Route: Mumbai → Delhi               │
│  • Flight Date: March 15, 2026         │
│  • Departure: 10:00 AM                 │
│  • Arrival: 12:15 PM                   │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  📥 Download Your E-Ticket        │ │ ← CLICK HERE
│  └───────────────────────────────────┘ │
│                                         │
│  ⚠️ Important Information               │
│  • Arrive 2 hours before departure     │
│  • Cancel up to 3 days before flight  │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🔧 TROUBLESHOOTING

### Problem: Email Not Sending

**Check:**
```
1. Is EMAIL_USER correct?
2. Is EMAIL_PASSWORD correct? (16 characters, no spaces)
3. Did you restart backend server?
4. Check backend logs for errors
```

**Solution:**
```bash
# Test email configuration
cd backend
node test-email.js

# If test fails, regenerate app password
```

---

### Problem: "Invalid login" Error

**Reason:** Wrong app password or regular password used

**Solution:**
```
1. Go to: https://myaccount.google.com/apppasswords
2. Delete old app password
3. Generate new app password
4. Update EMAIL_PASSWORD in .env
5. Restart backend
```

---

### Problem: Email Goes to Spam

**Solution:**
```
1. Check spam folder
2. Mark as "Not Spam"
3. Add sender to contacts
4. Future emails will go to inbox
```

---

### Problem: Download Link Not Working

**Check:**
```
1. Is BACKEND_URL correct in .env?
2. Is backend server running?
3. Try the link in browser directly
```

**Solution:**
```bash
# Verify backend URL
echo $BACKEND_URL

# Should be: http://localhost:5000
# Update in .env if different
```

---

## 📊 VERIFICATION CHECKLIST

### After Setup:

```
□ EMAIL_USER set in .env
□ EMAIL_PASSWORD set in .env (app password)
□ BACKEND_URL set in .env
□ Backend server restarted
□ Test booking created
□ Email received in inbox
□ Download button visible
□ Download button works
□ PDF downloads successfully
```

---

## 💡 IMPORTANT NOTES

### Gmail App Password:

```
✅ Use App Password, NOT regular password
✅ 16 characters, no spaces
✅ Generated from Google Account settings
✅ Can be revoked and regenerated anytime
```

### Email Content:

```
✅ Shows flight date (selected departure date)
✅ NOT booking date
✅ Includes all passenger details
✅ Shows payment summary
✅ Has download ticket button
✅ Professional design
```

### Ticket Download:

```
✅ Works immediately after booking
✅ No login required
✅ PDF generated automatically
✅ Includes all booking details
```

---

## 🎯 QUICK REFERENCE

### .env Template:

```bash
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
BACKEND_URL=http://localhost:5000
```

### Get App Password:

```
URL: https://myaccount.google.com/apppasswords
Steps: Select app → Select device → Generate → Copy
```

### Test Email:

```bash
cd backend
node test-email.js
```

### Restart Backend:

```bash
cd backend
npm start
```

---

## 📧 EMAIL TYPES

### 1. Booking Confirmation

```
Sent: When user completes booking
Includes: Booking details, flight info, download link
Subject: ✈️ Booking Confirmed - {BookingID}
```

### 2. Cancellation Confirmation

```
Sent: When user cancels booking
Includes: Cancellation details, refund info
Subject: ❌ Booking Cancelled - {BookingID}
```

---

## ✅ SUCCESS INDICATORS

### You'll Know It's Working When:

```
✅ Backend logs show: "✅ Booking confirmation email sent successfully"
✅ User receives email within 1-2 minutes
✅ Email has professional design
✅ Download button is visible
✅ Clicking button downloads PDF
✅ PDF contains all booking details
```

---

## 🎉 YOU'RE DONE!

**Your email system is now configured and working!**

Users will receive:
- ✅ Professional booking confirmation emails
- ✅ Direct ticket download links
- ✅ Cancellation emails with refund info
- ✅ All booking details beautifully formatted

**Start testing by creating a booking!** 🚀

---

**Setup Time:** 5 minutes  
**Difficulty:** Easy  
**Status:** Ready to Use  
**Support:** Check TICKET_DOWNLOAD_EMAIL_COMPLETE.md for details
