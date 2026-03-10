# ✈️ HOW TICKET CANCELLATION WORKS - SIMPLE GUIDE

## 🎯 QUICK ANSWER

**To cancel a ticket:**
1. Login → Click "🎫 My Tickets"
2. Find your booking → Click "❌ Cancel Ticket"
3. Select reason → Choose refund method → Confirm
4. Done! Email sent + Refund processed in 5-7 days

---

## 📋 STEP-BY-STEP VISUAL GUIDE

### Step 1: Go to My Tickets
```
┌─────────────────────────────────────────┐
│  🏠 Home  |  🎫 My Tickets  |  👤 Profile │
│                    ↑                     │
│              Click here                  │
└─────────────────────────────────────────┘
```

### Step 2: Find Your Booking
```
┌─────────────────────────────────────────┐
│ 📋 My Tickets                            │
├─────────────────────────────────────────┤
│                                          │
│  ✈️ Mumbai → Delhi                       │
│  Booking ID: BK1234567890               │
│  Flight Date: March 15, 2026            │
│  Status: Confirmed                      │
│                                          │
│  [📋 View Details]  [❌ Cancel Ticket]  │
│                           ↑              │
│                     Click here           │
└─────────────────────────────────────────┘
```

### Step 3: Cancellation Process (3 Steps)
```
Step 1: Select Reason
┌─────────────────────────────────────────┐
│ Why are you cancelling?                 │
│                                          │
│ ○ Medical Emergency                     │
│ ○ Family Emergency                      │
│ ○ Change of Plans                       │
│ ○ Other (specify)                       │
│                                          │
│ [Continue →]                            │
└─────────────────────────────────────────┘

Step 2: Choose Refund Method
┌─────────────────────────────────────────┐
│ How do you want your refund?            │
│                                          │
│ ○ Original Payment Method (5-7 days)    │
│ ○ Bank Transfer (3-5 days)              │
│ ○ Digital Wallet (Instant)              │
│ ○ Travel Voucher (110% value!)          │
│                                          │
│ Refund Amount: ₹5,000                   │
│ [Continue →]                            │
└─────────────────────────────────────────┘

Step 3: Confirm Cancellation
┌─────────────────────────────────────────┐
│ ⚠️ Final Confirmation                    │
│                                          │
│ Booking: Mumbai → Delhi                 │
│ Refund: ₹5,000                          │
│                                          │
│ ☑ I accept terms and conditions         │
│                                          │
│ [Confirm Cancellation]                  │
└─────────────────────────────────────────┘
```

### Step 4: Success!
```
┌─────────────────────────────────────────┐
│            ✅ Success!                   │
│                                          │
│  Your booking has been cancelled        │
│                                          │
│  Refund Amount: ₹5,000                  │
│  Processing Time: 5-7 business days     │
│  Status: Processing                     │
│                                          │
│  📧 Confirmation email sent!            │
│                                          │
│  [View My Bookings]  [Book New Flight]  │
└─────────────────────────────────────────┘
```

---

## 🔍 WHAT HAPPENS BEHIND THE SCENES

### When You Click "Cancel Ticket":

```
1. System Checks:
   ✓ Is flight more than 3 days away? → YES ✅
   ✓ Is booking already cancelled? → NO ✅
   ✓ Has flight departed? → NO ✅
   
   Result: Cancellation ALLOWED

2. Refund Calculation:
   Original Amount: ₹5,000
   Days since booking: 9 days
   
   Policy: Within 10 days = 100% refund
   Refund Amount: ₹5,000 (100%)

3. Database Update:
   Status: confirmed → cancelled
   Cancellation Date: March 10, 2026
   Refund Amount: ₹5,000
   Refund Status: processing
   
   ✅ Saved to MongoDB

4. Email Sent:
   To: your-email@example.com
   Subject: Booking Cancelled
   Content: Cancellation details + Refund info
   
   ✅ Email delivered

5. UI Update:
   - Removed from "My Tickets"
   - Added to "❌ Cancelled" section
   - Dashboard updated
   
   ✅ Complete!
```

---

## ⏰ CANCELLATION POLICY (IMPORTANT!)

### 3-Day Rule:
```
✅ CAN CANCEL:
   Flight Date: March 15, 2026
   Today: March 10, 2026
   Difference: 5 days (120 hours)
   
   120 hours > 72 hours (3 days) ✅
   → Cancellation ALLOWED

❌ CANNOT CANCEL:
   Flight Date: March 15, 2026
   Today: March 13, 2026
   Difference: 2 days (48 hours)
   
   48 hours < 72 hours (3 days) ❌
   → Cancellation BLOCKED
   
   Error: "Cancellation not allowed. Must be 
   at least 3 days before flight."
```

### Refund Calculation:
```
Based on BOOKING AGE (not flight date):

┌─────────────────────────────────────────┐
│ Days Since Booking  │  Refund Amount    │
├─────────────────────────────────────────┤
│ 0-10 days          │  100% (Full)      │
│ 11-30 days         │  75%              │
│ 31-60 days         │  50%              │
│ 60+ days           │  25%              │
└─────────────────────────────────────────┘

Example:
Booked: March 1, 2026
Cancelled: March 10, 2026
Days: 9 days
Refund: 100% (within 10 days)
```

---

## 📧 EMAIL NOTIFICATIONS

### You Will Receive 2 Emails:

#### 1. Booking Confirmation Email (When you book)
```
Subject: ✅ Booking Confirmed - BK1234567890

- Booking details
- Flight information
- Passenger details
- 📎 Ticket PDF attached
- Download link included
- Cancellation policy (3 days)
```

#### 2. Cancellation Email (When you cancel)
```
Subject: ❌ Booking Cancelled - BK1234567890

- Cancellation confirmation
- Cancellation date & reason
- Refund amount: ₹5,000
- Refund status: Processing
- Processing time: 5-7 business days
- Original booking details
```

---

## 💰 REFUND TIMELINE

### What Happens After Cancellation:

```
Day 0 (Today):
├─ Cancellation confirmed
├─ Email sent
└─ Status: Processing

Day 1-2:
├─ Refund initiated
└─ Status: Processing

Day 3-5:
├─ Bank processing
└─ Status: Processing

Day 5-7:
├─ Refund completed
├─ Money in your account
└─ Status: Completed ✅

Total Time: 5-7 business days
```

---

## 📱 WHERE TO CHECK STATUS

### Option 1: Cancelled Section
```
Navigation Bar → Click "❌ Cancelled (X)"

You'll see:
- All cancelled bookings
- Refund amounts
- Refund status (Processing/Completed)
- Cancellation dates
- Cancellation reasons
```

### Option 2: Dashboard
```
Go to: Booking Dashboard

You'll see:
- Cancellation statistics
- Recent cancellations
- Total refund amounts
- Refund status breakdown
```

---

## 🎯 SPECIAL FEATURES

### 1. 10-Day Guarantee 🛡️
```
Cancel within 10 days of booking:
✅ 100% full refund
✅ Fast processing (1-2 days)
✅ No questions asked

Example:
Booked: March 1
Cancelled: March 9 (8 days later)
Refund: 100% (₹5,000)
Processing: 1-2 days
```

### 2. Travel Voucher Bonus 🎫
```
Choose "Travel Voucher" as refund method:
✅ Get 110% of refund amount
✅ Instant credit
✅ Use for future bookings

Example:
Original Refund: ₹5,000
Voucher Value: ₹5,500 (110%)
Bonus: ₹500 extra!
```

---

## ❌ WHEN YOU CANNOT CANCEL

### Scenario 1: Less than 3 Days
```
Flight Date: March 15, 2026
Today: March 13, 2026
Difference: 2 days

❌ Cannot cancel
Reason: Less than 3 days (72 hours)
Message: "Cancellation not allowed"
```

### Scenario 2: Already Cancelled
```
Status: Cancelled

❌ Cannot cancel again
Reason: Already cancelled
Message: "Booking is already cancelled"
```

### Scenario 3: Flight Departed
```
Flight Date: March 10, 2026
Today: March 15, 2026

❌ Cannot cancel
Reason: Flight already departed
Message: "Cannot cancel past flights"
```

---

## 🔍 EXAMPLE: COMPLETE FLOW

### Real Example:

```
📅 March 1, 2026 - BOOKING
User books flight:
- Route: Mumbai → Delhi
- Flight Date: March 15, 2026
- Amount: ₹5,000
- Booking ID: BK1234567890
✅ Confirmation email sent with ticket

📅 March 10, 2026 - CANCELLATION
User decides to cancel:
- Days until flight: 5 days ✅ (>3 days)
- Days since booking: 9 days ✅ (within 10)

User clicks "Cancel Ticket":
1. Selects reason: "Change of Plans"
2. Chooses refund: "Original Payment Method"
3. Confirms cancellation

System processes:
✅ Eligibility check passed
✅ Refund calculated: ₹5,000 (100%)
✅ Status changed to "cancelled"
✅ Saved to MongoDB
✅ Email sent

User receives:
✅ Success notification
✅ Cancellation email
✅ Refund confirmation

📅 March 17, 2026 - REFUND COMPLETE
- Refund processed
- Money in account
- Status: Completed
- Total time: 7 days
```

---

## 💡 PRO TIPS

### Before Cancelling:
```
✅ Check flight date (must be >3 days away)
✅ Check booking age (within 10 days = 100% refund)
✅ Consider travel voucher (110% value)
✅ Save booking details for reference
✅ Note refund timeline (5-7 days)
```

### After Cancelling:
```
✅ Check email for confirmation
✅ Note refund amount and status
✅ Track in "Cancelled" section
✅ Wait 5-7 business days
✅ Contact support if delayed
```

---

## 🚨 TROUBLESHOOTING

### Problem: "Cancel Ticket" button is disabled
```
Reason: Flight is less than 3 days away
Solution: Cannot cancel (policy restriction)
Alternative: Contact customer support
```

### Problem: Error when clicking cancel
```
Reason: Network or server issue
Solution:
1. Refresh the page
2. Try again
3. Check internet connection
4. Clear browser cache
5. Contact support if persists
```

### Problem: Refund not received after 7 days
```
Reason: Processing delay
Solution:
1. Check status in "Cancelled" section
2. Verify refund method details
3. Contact your bank
4. Contact customer support
5. Provide booking ID: BK1234567890
```

---

## 📞 CUSTOMER SUPPORT

### Need Help?
```
📞 Phone: +91-6301616095
📧 Email: support@akgroup.com
🕒 Hours: 24/7 (Always available)
💬 Live Chat: Available on website
```

### What to Provide:
```
- Booking ID: BK1234567890
- Email: your-email@example.com
- Issue description
- Screenshots (if applicable)
```

---

## ✅ QUICK CHECKLIST

### Before Cancelling:
- [ ] Logged into account
- [ ] Flight is >3 days away
- [ ] Checked refund amount
- [ ] Selected refund method
- [ ] Ready to confirm

### After Cancelling:
- [ ] Success message received
- [ ] Email confirmation received
- [ ] Booking in "Cancelled" section
- [ ] Refund status shows "Processing"
- [ ] Noted refund timeline

---

## 🎉 SUMMARY

**Cancellation is EASY:**
1. My Tickets → Find booking → Cancel Ticket
2. Select reason → Choose refund method
3. Confirm → Done!

**Remember:**
- ✅ Must be >3 days before flight
- ✅ Within 10 days = 100% refund
- ✅ Email confirmation sent
- ✅ Refund in 5-7 days
- ✅ Track in "Cancelled" section

**That's it! Simple and straightforward!** 🚀

---

## 📚 RELATED GUIDES

For more detailed information, see:
- `HOW_TO_CANCEL_TICKET_GUIDE.md` - Complete detailed guide
- `THREE_DAY_CANCELLATION_POLICY_COMPLETE.md` - Policy details
- `CANCELLATION_BASED_ON_FLIGHT_DATE_CONFIRMED.md` - Date calculation

---

**Last Updated:** March 8, 2026
**Version:** 1.0
**Status:** ✅ All features working
