# 📸 Visual Test Guide - What You Should See

## 1. Booking Confirmation Email

### Email Subject
```
✈️ Booking Confirmed - BK1234567890
```

### Email Content (Top Section)
```
┌─────────────────────────────────────────┐
│  ✈️ Booking Confirmed!                  │
│  Your flight is booked and ready        │
│  [Purple/Blue Gradient Header]          │
└─────────────────────────────────────────┘

Dear [Your Name],

Thank you for booking with us! Your flight 
reservation has been confirmed.

┌─────────────────────────────────────────┐
│  📥 Download Your E-Ticket              │
│  [Blue Button - Clickable]              │
│                                         │
│  Click the button above to download     │
│  your ticket PDF                        │
└─────────────────────────────────────────┘
```

### Email Content (Booking Details)
```
┌─────────────────────────────────────────┐
│ 📋 Booking Details                      │
├─────────────────────────────────────────┤
│ Booking ID:          BK1234567890       │
│ Confirmation Number: BF123456           │
│ E-Ticket Number:     ET987654321        │
│ Booking Date:        March 9, 2026      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ✈️ Flight Information                   │
├─────────────────────────────────────────┤
│         DEL → BOM                       │
│                                         │
│ Flight Date:     March 15, 2026         │ ← This should be your selected date
│ Departure Time:  10:30 AM               │
│ Arrival Time:    12:45 PM               │
│ Flight Number:   AI101                  │
│ Airline:         Air India              │
└─────────────────────────────────────────┘
```

### What to Check
- ✅ Email has professional design (not plain text)
- ✅ "Download Your E-Ticket" button is visible
- ✅ Flight Date shows the date you selected (not today)
- ✅ All booking details are present
- ✅ Button is clickable and downloads PDF

---

## 2. My Tickets Page

### What You Should See
```
┌─────────────────────────────────────────────────────┐
│ My Tickets                                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│ [Flight Image]                                      │
│                                                     │
│ DEL → BOM                                           │
│ Air India                                           │
│                                                     │
│ Flight Date: March 15, 2026  ← Should be selected date
│ Booking ID: BK1234567890                            │
│ Status: Confirmed                                   │
│                                                     │
│ [View Details] [Download Ticket] [Cancel]           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### What to Check
- ✅ Shows "Flight Date:" (not "Booking Date:")
- ✅ Date matches what you selected during search
- ✅ NOT today's date (unless you booked for today)

---

## 3. Cancellation Page (Can Cancel)

### When Flight is >3 Days Away
```
┌─────────────────────────────────────────────────────┐
│ ❌ Cancel Booking                                   │
├─────────────────────────────────────────────────────┤
│ Booking ID: BK1234567890 | DEL → BOM                │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Progress: [1] → [2] → [3] → [4]                     │
│          Reason  Refund  Confirm  Complete          │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 📝 Reason for Cancellation                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│ [Flight Image]                                      │
│ DEL → BOM                                           │
│                                                     │
│ Airline: Air India                                  │
│ Time until flight: 5 days  ← Based on flight date  │
│                                                     │
│ Select Cancellation Reason:                         │
│ [ ] 🏥 Medical Emergency                            │
│ [ ] 👨‍👩‍👧‍👦 Family Emergency                            │
│ [ ] 💼 Work Commitment                              │
│ ...                                                 │
│                                                     │
│ [Cancel Process] [Continue →]                       │
└─────────────────────────────────────────────────────┘
```

### What to Check
- ✅ Shows "Time until flight: X days"
- ✅ Time is calculated from flight date (not booking date)
- ✅ Allows you to continue with cancellation
- ✅ Shows refund calculation

---

## 4. Cancellation Page (Cannot Cancel)

### When Flight is <3 Days Away
```
┌─────────────────────────────────────────────────────┐
│ ⚠️ Cannot Cancel Booking                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Cannot cancel - bookings can only be cancelled      │
│ at least 3 days (72 hours) before the flight.      │
│                                                     │
│ Your flight is in 2 days and 5 hours.              │
│                                                     │
│ [Back to My Bookings]                               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### What to Check
- ✅ Shows clear error message
- ✅ Shows exact time until flight (e.g., "2 days and 5 hours")
- ✅ Time is based on flight date (not booking date)
- ✅ Does not allow cancellation

---

## 5. Downloaded Ticket PDF

### What the PDF Should Contain
```
┌─────────────────────────────────────────────────────┐
│                 E-TICKET                            │
│                                                     │
│ Confirmation Number: BF123456                       │
│ E-Ticket Number: ET987654321                        │
│                                                     │
│ PASSENGER INFORMATION                               │
│ Name: [Your Name]                                   │
│ Email: [Your Email]                                 │
│                                                     │
│ FLIGHT DETAILS                                      │
│ From: Delhi (DEL)                                   │
│ To: Mumbai (BOM)                                    │
│ Date: March 15, 2026  ← Your selected date         │
│ Departure: 10:30 AM                                 │
│ Arrival: 12:45 PM                                   │
│                                                     │
│ BOOKING INFORMATION                                 │
│ Booking ID: BK1234567890                            │
│ Total Amount: ₹5,000                                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### What to Check
- ✅ PDF downloads successfully
- ✅ Shows flight date (not booking date)
- ✅ All details are correct

---

## Common Issues and What They Mean

### Issue: Email shows today's date as "Flight Date"
**Problem**: System is using booking date instead of flight date
**Status**: This should be FIXED now

### Issue: Can't cancel even though flight is 5 days away
**Problem**: System is checking booking date instead of flight date
**Status**: This should be FIXED now

### Issue: Email has no download button
**Problem**: Email service is using old template
**Status**: This should be FIXED now

### Issue: Email says only "Booking Confirmed"
**Problem**: Email service is simplified version
**Status**: This should be FIXED now

---

## Expected vs Actual

### ✅ CORRECT Behavior (What You Should See Now)

| Feature | What You Should See |
|---------|-------------------|
| Email | Professional design with download button |
| Flight Date | The date you selected during search |
| Cancellation | Checks flight date (allows cancel if >3 days) |
| Time Until Flight | Based on flight departure date |
| Ticket Display | Shows "Flight Date:" with correct date |

### ❌ INCORRECT Behavior (What You Should NOT See)

| Feature | What You Should NOT See |
|---------|----------------------|
| Email | Plain "Booking Confirmed" message |
| Flight Date | Today's date (unless you booked for today) |
| Cancellation | "Cannot cancel" when flight is 5+ days away |
| Time Until Flight | Negative hours or "departed" when flight is future |
| Ticket Display | "Booking Date:" or today's date |

---

## Test Scenarios

### Scenario 1: Book Flight for Next Week
1. Select date: March 16, 2026 (7 days from now)
2. Book the flight
3. **Expected**:
   - Email shows "Flight Date: March 16, 2026"
   - Ticket shows "Flight Date: March 16, 2026"
   - Cancellation shows "Time until flight: 7 days"
   - Can cancel the booking

### Scenario 2: Book Flight for Tomorrow
1. Select date: March 10, 2026 (1 day from now)
2. Book the flight
3. **Expected**:
   - Email shows "Flight Date: March 10, 2026"
   - Ticket shows "Flight Date: March 10, 2026"
   - Cancellation shows "Cannot cancel - flight is in 1 day"
   - Cannot cancel the booking

### Scenario 3: Download Ticket from Email
1. Book any flight
2. Open confirmation email
3. Click "Download Your E-Ticket" button
4. **Expected**:
   - PDF downloads immediately
   - PDF shows correct flight date
   - PDF has all booking details

---

**All fixes are complete! Test and verify!** ✅
