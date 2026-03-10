# 🎯 HOW TO CANCEL A TICKET - COMPLETE GUIDE

## 📋 STEP-BY-STEP CANCELLATION PROCESS

### Method 1: Cancel from "My Tickets" (Recommended)

#### Step 1: Login to Your Account
```
1. Go to: http://localhost:5174/login
2. Enter your email and password
3. Click "Login"
4. You'll be redirected to home page
```

#### Step 2: Go to My Tickets
```
1. Click "🎫 My Tickets" button in the navigation bar
2. You'll see all your active bookings
```

#### Step 3: Find the Booking to Cancel
```
You'll see booking cards showing:
┌─────────────────────────────────────┐
│ Mumbai → Delhi              [Active]│
│ Booking ID: BK1234567890           │
│                                     │
│ Departure: 10:00 AM                │
│ Arrival: 12:30 PM                  │
│                                     │
│ Airline: Air India                 │
│ Flight Date: March 15, 2026        │
│                                     │
│ [📋 View Details] [❌ Cancel Ticket]│
└─────────────────────────────────────┘
```

#### Step 4: Click "Cancel Ticket" Button
```
1. Click the red "❌ Cancel Ticket" button
2. A confirmation dialog will appear
```

#### Step 5: Confirm Cancellation
```
Dialog will show:
┌─────────────────────────────────────┐
│ ⚠️ Cancel Booking?                  │
│                                     │
│ Are you sure you want to cancel     │
│ this booking?                       │
│                                     │
│ Booking: Mumbai → Delhi             │
│ Flight Date: March 15, 2026         │
│                                     │
│ Refund Amount: ₹5,000              │
│ (Based on cancellation policy)      │
│                                     │
│ Reason (optional):                  │
│ [Text input box]                    │
│                                     │
│ [Cancel] [Confirm Cancellation]     │
└─────────────────────────────────────┘
```

#### Step 6: Enter Reason (Optional)
```
You can enter a reason like:
- "Change of plans"
- "Emergency"
- "Found better option"
- Or leave it blank
```

#### Step 7: Confirm
```
1. Click "Confirm Cancellation" button
2. System will process the cancellation
```

#### Step 8: Cancellation Complete
```
You'll see:
✅ Success toast: "Booking cancelled successfully"
✅ Refund amount displayed
✅ Email sent to your inbox
✅ Booking moved to "Cancelled" section
```

---

## 🔍 WHAT HAPPENS DURING CANCELLATION

### 1. System Checks Eligibility
```javascript
Current Date: March 10, 2026
Flight Date: March 15, 2026
Difference: 5 days (120 hours)

Check: Is 120 hours > 72 hours (3 days)?
Result: YES ✅

Action: Allow cancellation
```

### 2. Refund Calculation
```javascript
Booking Date: March 1, 2026
Cancellation Date: March 10, 2026
Days from booking: 9 days

Refund Policy:
- Within 10 days: 100% refund
- 11-30 days: 75% refund
- 31-60 days: 50% refund
- 60+ days: 25% refund

Result: 100% refund (within 10 days)
Refund Amount: ₹5,000
```

### 3. Database Update
```javascript
MongoDB Update:
{
  status: "cancelled",
  cancellation: {
    isCancelled: true,
    cancelledAt: "2026-03-10T14:30:00.000Z",
    cancellationReason: "User requested",
    refundAmount: 5000,
    refundStatus: "processing"
  }
}
```

### 4. Email Notification
```
Email sent to: your-email@example.com
Subject: ❌ Booking Cancelled - BK1234567890 - Refund: ₹5,000

Content:
- Cancellation confirmation
- Refund amount
- Refund status
- Original booking details
- Refund timeline (5-7 business days)
```

### 5. UI Update
```
- Booking removed from "My Tickets"
- Booking appears in "❌ Cancelled" section
- Dashboard statistics updated
- Cancelled count increased
```

---

## ❌ WHEN CANCELLATION IS NOT ALLOWED

### Scenario 1: Less than 3 Days Before Flight
```
Current Date: March 13, 2026
Flight Date: March 15, 2026
Difference: 2 days (48 hours)

Check: Is 48 hours > 72 hours?
Result: NO ❌

Error Message:
"Cancellation not allowed. Bookings can only be 
cancelled at least 3 days (72 hours) before the 
flight. Your flight is in 2 days and 0 hours."

Action: Cancellation blocked
```

### Scenario 2: Already Cancelled
```
Status: "cancelled"

Error Message:
"This booking is already cancelled"

Action: Cancellation blocked
```

### Scenario 3: Flight Completed
```
Status: "completed"

Error Message:
"Cannot cancel completed booking"

Action: Cancellation blocked
```

---

## 📧 EMAIL NOTIFICATIONS

### Cancellation Email You'll Receive:
```
From: Flight Booking System
To: your-email@example.com
Subject: ❌ Booking Cancelled - BK1234567890 - Refund: ₹5,000

┌─────────────────────────────────────┐
│ ❌ Booking Cancelled                │
├─────────────────────────────────────┤
│                                     │
│ Your booking has been cancelled     │
│                                     │
│ Booking ID: BK1234567890           │
│ Cancelled On: Mar 10, 2026 2:30 PM│
│ Reason: User requested             │
│                                     │
│ Flight Details:                     │
│ Route: Mumbai → Delhi               │
│ Airline: Air India                 │
│ Scheduled: Mar 15, 2026 10:00 AM   │
│                                     │
│ 💰 Refund Information               │
│ Refund Amount: ₹5,000              │
│ Refund Status: PROCESSING          │
│                                     │
│ The refund will be processed within│
│ 5-7 business days to your original │
│ payment method.                     │
└─────────────────────────────────────┘
```

---

## 🎯 CANCELLATION POLICY

### 3-Day Rule:
```
✅ CAN Cancel: More than 3 days (72 hours) before flight
❌ CANNOT Cancel: Less than 3 days before flight
```

### Refund Calculation:
```
Within 10 days of booking:  100% refund
11-30 days after booking:   75% refund
31-60 days after booking:   50% refund
More than 60 days:          25% refund
```

### Refund Timeline:
```
Processing Time: 5-7 business days
Refund Method: Original payment method
Refund Status: Tracked in system
```

---

## 📱 WHERE TO VIEW CANCELLED BOOKINGS

### Option 1: Cancelled Section
```
1. Click "❌ Cancelled (X)" button in navigation
2. View all your cancelled bookings
3. See refund status and amounts
```

### Option 2: Dashboard
```
1. Go to: http://localhost:5174/booking-dashboard
2. View "Recent Cancellations" section
3. See cancellation statistics
```

---

## 🔍 CANCELLATION STATUS TRACKING

### Refund Statuses:
```
🟡 PROCESSING - Refund is being processed
🟢 COMPLETED - Refund has been issued
🔴 FAILED - Refund failed (contact support)
⚪ PENDING - Awaiting processing
```

### How to Check Status:
```
1. Go to "❌ Cancelled" section
2. Find your cancelled booking
3. Check "Refund Status" badge
4. Color indicates current status
```

---

## 🧪 EXAMPLE CANCELLATION FLOW

### Complete Example:
```
Step 1: User books flight
- Booking Date: March 1, 2026
- Flight Date: March 15, 2026
- Amount: ₹5,000

Step 2: User decides to cancel (March 10, 2026)
- Days until flight: 5 days
- Days since booking: 9 days

Step 3: User clicks "Cancel Ticket"
- System checks: 5 days > 3 days ✅
- Refund: 100% (within 10 days)
- Refund Amount: ₹5,000

Step 4: Confirmation
- Status changed to "cancelled"
- Saved to MongoDB
- Email sent

Step 5: User receives
- Success notification
- Cancellation email
- Refund confirmation

Step 6: Refund processed
- 5-7 business days
- Original payment method
- Status updated to "completed"
```

---

## 💡 TIPS

### Before Cancelling:
```
✅ Check flight date (must be > 3 days away)
✅ Check refund amount (based on booking age)
✅ Note refund timeline (5-7 business days)
✅ Save booking details for reference
```

### After Cancelling:
```
✅ Check email for confirmation
✅ Note refund amount and status
✅ Track refund in "Cancelled" section
✅ Contact support if refund delayed
```

---

## 🚨 TROUBLESHOOTING

### Issue 1: "Cancel Ticket" Button Disabled
```
Reason: Flight is less than 3 days away
Solution: Cannot cancel (policy restriction)
```

### Issue 2: Error When Clicking Cancel
```
Reason: Network or server issue
Solution: 
1. Refresh page
2. Try again
3. Check internet connection
4. Contact support if persists
```

### Issue 3: Refund Not Received
```
Reason: Processing delay
Solution:
1. Check refund status in "Cancelled" section
2. Wait 5-7 business days
3. Contact support after 7 days
```

---

## 📞 NEED HELP?

### Contact Support:
```
Email: support@flightbooking.com
Phone: [Support Number]
Hours: 24/7
```

### Common Questions:
```
Q: How long for refund?
A: 5-7 business days

Q: Can I cancel anytime?
A: Only if > 3 days before flight

Q: How much refund?
A: Depends on booking age (see policy)

Q: Where to track refund?
A: "Cancelled" section shows status
```

---

## ✅ QUICK CHECKLIST

Before cancelling, verify:
- [ ] Logged into your account
- [ ] Flight is > 3 days away
- [ ] Checked refund amount
- [ ] Ready to confirm cancellation
- [ ] Email address is correct (for confirmation)

After cancelling, verify:
- [ ] Success message received
- [ ] Email confirmation received
- [ ] Booking in "Cancelled" section
- [ ] Refund status shows "Processing"
- [ ] Refund amount is correct

---

## 🎉 SUMMARY

**To cancel a ticket:**
1. Login → "My Tickets"
2. Find booking → Click "Cancel Ticket"
3. Enter reason (optional) → Confirm
4. Receive confirmation email
5. Track refund in "Cancelled" section
6. Refund processed in 5-7 days

**Remember:**
- Must be > 3 days before flight
- Refund based on booking age
- Email confirmation sent
- Track status in dashboard

**That's it! Simple and straightforward!** 🚀
