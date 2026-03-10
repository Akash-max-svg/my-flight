# 🔄 TICKET CANCELLATION FLOW DIAGRAM

## 📊 COMPLETE SYSTEM FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER STARTS CANCELLATION                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: User clicks "🎫 My Tickets" in navigation              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 2: System loads all user bookings from MongoDB            │
│  - Query: { user: userId, status: 'confirmed' }                 │
│  - Displays: Active bookings with details                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 3: User finds booking and clicks "❌ Cancel Ticket"       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 4: System checks eligibility                              │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Check 1: Is flight >3 days away?                          │ │
│  │ - Current Date: March 10, 2026                            │ │
│  │ - Flight Date: March 15, 2026                             │ │
│  │ - Difference: 5 days (120 hours)                          │ │
│  │ - Required: >72 hours (3 days)                            │ │
│  │ - Result: ✅ PASS                                          │ │
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Check 2: Is booking already cancelled?                    │ │
│  │ - Status: confirmed                                       │ │
│  │ - Result: ✅ PASS                                          │ │
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Check 3: Has flight departed?                             │ │
│  │ - Flight Date: March 15, 2026                             │ │
│  │ - Current Date: March 10, 2026                            │ │
│  │ - Result: ✅ PASS                                          │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    ALL CHECKS PASSED ✅
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 5: Navigate to Cancellation Page                          │
│  - Route: /cancel-booking/:bookingId                            │
│  - Component: BookingCancellation.jsx                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  CANCELLATION WIZARD - STEP 1: SELECT REASON                    │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ User selects reason:                                      │ │
│  │ ○ Medical Emergency                                       │ │
│  │ ○ Family Emergency                                        │ │
│  │ ○ Work Commitment                                         │ │
│  │ ○ Change of Plans                                         │ │
│  │ ○ Other (custom reason)                                   │ │
│  └───────────────────────────────────────────────────────────┘ │
│  User clicks "Continue →"                                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  CANCELLATION WIZARD - STEP 2: REFUND METHOD                    │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ System calculates refund:                                 │ │
│  │ - Booking Date: March 1, 2026                             │ │
│  │ - Cancellation Date: March 10, 2026                       │ │
│  │ - Days since booking: 9 days                              │ │
│  │ - Policy: Within 10 days = 100% refund                    │ │
│  │ - Original Amount: ₹5,000                                 │ │
│  │ - Refund Amount: ₹5,000 (100%)                            │ │
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ User selects refund method:                               │ │
│  │ ○ Original Payment Method (5-7 days)                      │ │
│  │ ○ Bank Transfer (3-5 days)                                │ │
│  │ ○ Digital Wallet (Instant)                                │ │
│  │ ○ Travel Voucher (110% value)                             │ │
│  └───────────────────────────────────────────────────────────┘ │
│  User clicks "Continue →"                                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  CANCELLATION WIZARD - STEP 3: CONFIRMATION                     │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Summary displayed:                                        │ │
│  │ - Booking ID: BK1234567890                                │ │
│  │ - Flight: Mumbai → Delhi                                  │ │
│  │ - Reason: Change of Plans                                 │ │
│  │ - Refund Method: Original Payment                         │ │
│  │ - Refund Amount: ₹5,000                                   │ │
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ User accepts terms:                                       │ │
│  │ ☑ I accept terms and conditions                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│  User clicks "Confirm Cancellation"                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  BACKEND PROCESSING                                              │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 1. API Call to Backend                                    │ │
│  │    POST /api/bookings/:id/cancel                          │ │
│  │    Headers: { Authorization: Bearer token }               │ │
│  │    Body: { reason, refundMethod, notes }                  │ │
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 2. Backend validates again (security)                     │ │
│  │    - Check user owns booking                              │ │
│  │    - Check flight date >3 days                            │ │
│  │    - Check booking not already cancelled                  │ │
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 3. Calculate refund amount                                │ │
│  │    const refundAmount = booking.calculateRefund()         │ │
│  │    Result: ₹5,000                                         │ │
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 4. Update MongoDB                                         │ │
│  │    booking.status = 'cancelled'                           │ │
│  │    booking.cancellation = {                               │ │
│  │      isCancelled: true,                                   │ │
│  │      cancelledAt: new Date(),                             │ │
│  │      cancellationReason: "Change of Plans",               │ │
│  │      refundAmount: 5000,                                  │ │
│  │      refundStatus: "processing"                           │ │
│  │    }                                                       │ │
│  │    await booking.save()                                   │ │
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 5. Send Email Notification                                │ │
│  │    sendCancellationEmail(booking, userEmail)              │ │
│  │    - Subject: Booking Cancelled                           │ │
│  │    - Content: Cancellation details + Refund info          │ │
│  │    - Status: Sent ✅                                       │ │
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 6. Return Success Response                                │ │
│  │    { status: 'success', data: { booking, refundAmount } } │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  CANCELLATION WIZARD - STEP 4: SUCCESS                          │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │            ✅ Cancellation Successful!                     │ │
│  │                                                            │ │
│  │  Your booking has been cancelled                          │ │
│  │  Refund Amount: ₹5,000                                    │ │
│  │  Processing Time: 5-7 business days                       │ │
│  │  Status: Processing                                       │ │
│  │                                                            │ │
│  │  📧 Confirmation email sent!                              │ │
│  │                                                            │ │
│  │  [Download Receipt] [View Bookings] [Book New Flight]    │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  UI UPDATES                                                      │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 1. Booking removed from "My Tickets"                      │ │
│  │ 2. Booking added to "❌ Cancelled" section                │ │
│  │ 3. Dashboard statistics updated                           │ │
│  │ 4. Cancelled count increased                              │ │
│  │ 5. Event dispatched: 'bookingUpdated'                     │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  USER RECEIVES EMAIL                                             │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ From: Flight Booking System                               │ │
│  │ To: user@example.com                                      │ │
│  │ Subject: ❌ Booking Cancelled - BK1234567890              │ │
│  │                                                            │ │
│  │ Content:                                                  │ │
│  │ - Cancellation confirmation                               │ │
│  │ - Booking details                                         │ │
│  │ - Cancellation date & reason                              │ │
│  │ - Refund amount: ₹5,000                                   │ │
│  │ - Refund status: Processing                               │ │
│  │ - Processing time: 5-7 business days                      │ │
│  │ - Contact information                                     │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  REFUND PROCESSING (5-7 BUSINESS DAYS)                          │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Day 0: Cancellation confirmed                             │ │
│  │ Day 1-2: Refund initiated                                 │ │
│  │ Day 3-5: Bank processing                                  │ │
│  │ Day 5-7: Refund completed                                 │ │
│  │                                                            │ │
│  │ Status updated in MongoDB:                                │ │
│  │ refundStatus: "processing" → "completed"                  │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CANCELLATION COMPLETE ✅                      │
│  - Booking cancelled in database                                │
│  - Refund processed                                              │
│  - User notified via email                                       │
│  - UI updated                                                    │
│  - Money returned to user                                        │
└─────────────────────────────────────────────────────────────────┘
```

## 🔍 KEY COMPONENTS INVOLVED

### Frontend Components:
```
1. Home.jsx
   - Displays "My Tickets" section
   - Shows "Cancel Ticket" button
   - Handles navigation to cancellation page

2. BookingCancellation.jsx
   - Multi-step cancellation wizard
   - Reason selection
   - Refund method selection
   - Final confirmation
   - Success screen

3. bookingService.js
   - API calls to backend
   - Data fetching and updates
   - Local state management
```

### Backend Components:
```
1. booking.routes.js
   - POST /api/bookings/:id/cancel
   - Handles cancellation requests
   - Validates eligibility
   - Processes cancellation

2. Booking.model.js
   - MongoDB schema
   - Cancellation logic
   - Refund calculation
   - 3-day policy enforcement

3. email.service.js
   - sendCancellationEmail()
   - Email template generation
   - SMTP delivery
```

### Database:
```
MongoDB Collections:
- bookings
  - status: 'confirmed' → 'cancelled'
  - cancellation: { ... }
  - Updated in real-time
```

---

## 📊 DATA FLOW

```
User Action → Frontend → API Call → Backend → MongoDB → Email → Response → UI Update

1. User clicks "Cancel Ticket"
   ↓
2. Frontend validates and navigates
   ↓
3. API POST /api/bookings/:id/cancel
   ↓
4. Backend validates eligibility
   ↓
5. MongoDB booking updated
   ↓
6. Email notification sent
   ↓
7. Success response returned
   ↓
8. UI updated with new status
```

---

**Last Updated:** March 8, 2026
**Status:** ✅ Fully Implemented and Working
