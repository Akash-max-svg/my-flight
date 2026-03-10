# 🔧 FIX BOOKINGS DISPLAY - SHOW MEALS & CANCELLED TICKETS

## 🎯 ISSUES TO FIX

1. ❌ Meal/food data not showing in bookings
2. ❌ Cancelled bookings not displaying
3. ❌ User can't see their cancelled tickets
4. ❌ Meal data not being saved to MongoDB

---

## ✅ CURRENT STATUS

### What's Already Working:
- ✅ Booking model has `mealBookings` field
- ✅ Cancellation data saves to MongoDB
- ✅ Backend API has cancelled bookings endpoint
- ✅ User bookings load from MongoDB

### What Needs Fixing:
- ❌ Frontend doesn't display meal data
- ❌ Frontend doesn't show cancelled bookings section
- ❌ Meal selection not integrated with booking flow
- ❌ No visual indicator for meals in tickets

---

## 🔍 DATA STRUCTURE

### Booking Model (MongoDB):
```javascript
{
  bookingId: "BK...",
  user: ObjectId,
  flight: {...},
  passengers: [{
    firstName: "...",
    lastName: "...",
    mealPreference: "vegetarian" // ← MEAL DATA HERE
  }],
  mealBookings: [{  // ← DETAILED MEAL DATA
    passengerId: "...",
    passengerName: "...",
    mealId: "...",
    mealName: "...",
    mealType: "...",
    price: 500,
    quantity: 1
  }],
  mealTotalPrice: 1500,
  status: "confirmed" or "cancelled",
  cancellation: {
    isCancelled: true,
    cancelledAt: Date,
    cancellationReason: "...",
    refundAmount: 5000,
    refundStatus: "processing"
  }
}
```

---

## 🛠️ FIXES NEEDED

### 1. Display Meal Data in My Tickets
**Location**: `src/Components/Home.jsx` (My Tickets section)

Add meal information display:
```jsx
{/* Meal Information */}
{booking.mealBookings && booking.mealBookings.length > 0 && (
  <div className="mb-3">
    <small className="text-muted">🍽️ Meals Ordered:</small>
    <div className="mt-2">
      {booking.mealBookings.map((meal, idx) => (
        <div key={idx} className="d-flex justify-content-between align-items-center mb-1">
          <span className="fw-semibold">{meal.passengerName}: {meal.mealName}</span>
          <span className="text-success">₹{meal.price}</span>
        </div>
      ))}
      <div className="border-top pt-2 mt-2">
        <strong>Total Meal Cost: ₹{booking.mealTotalPrice}</strong>
      </div>
    </div>
  </div>
)}
```

### 2. Add Cancelled Bookings Section
**Location**: `src/Components/Home.jsx`

Add new tab/section for cancelled bookings:
```jsx
{active === "CANCELLED" && (
  <div className="p-5">
    <h2>❌ Cancelled Tickets</h2>
    {cancelledBookings.length > 0 ? (
      <div className="row g-4">
        {cancelledBookings.map((booking) => (
          <div key={booking.bookingId} className="col-lg-6">
            <div className="bg-light rounded-4 shadow p-4 border border-danger">
              {/* Show cancellation details */}
              <div className="badge bg-danger mb-2">Cancelled</div>
              <h5>{booking.flight.from} → {booking.flight.to}</h5>
              <div className="text-muted">
                Cancelled on: {new Date(booking.cancellation.cancelledAt).toLocaleDateString()}
              </div>
              <div className="text-muted">
                Reason: {booking.cancellation.cancellationReason}
              </div>
              <div className="text-success fw-bold mt-2">
                Refund: ₹{booking.cancellation.refundAmount}
              </div>
              <div className="text-muted">
                Status: {booking.cancellation.refundStatus}
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-5">
        <p>No cancelled bookings</p>
      </div>
    )}
  </div>
)}
```

### 3. Save Meal Data When Booking
**Location**: `src/services/bookingService.js`

Ensure meal data is included in booking:
```javascript
async saveBooking(bookingData) {
  // ... existing code ...
  
  const response = await apiService.createBooking({
    // ... existing fields ...
    
    // Add meal data
    mealBookings: bookingData.mealBookings || [],
    mealTotalPrice: bookingData.mealTotalPrice || 0,
    
    // Update passengers with meal preferences
    passengers: bookingData.passengers.map(p => ({
      // ... existing fields ...
      mealPreference: p.mealPreference || 'no-preference'
    }))
  });
}
```

### 4. Add Navigation Button for Cancelled Tickets
**Location**: `src/Components/Home.jsx` (Navigation)

Add button to view cancelled bookings:
```jsx
<button
  className={`btn ${active === "CANCELLED" ? "btn-danger" : "btn-outline-danger"}`}
  onClick={() => setActive("CANCELLED")}
>
  ❌ Cancelled Tickets ({cancelledBookings.length})
</button>
```

---

## 📋 IMPLEMENTATION CHECKLIST

- [ ] Add meal display in My Tickets section
- [ ] Create Cancelled Bookings section
- [ ] Add navigation button for cancelled tickets
- [ ] Ensure meal data saves to MongoDB
- [ ] Test meal data display
- [ ] Test cancelled bookings display
- [ ] Verify data loads from MongoDB

---

## 🧪 TESTING STEPS

### Test Meal Display:
1. Book a flight with meal selection
2. Go to "My Tickets"
3. Verify meal information shows
4. Check meal prices display correctly

### Test Cancelled Bookings:
1. Cancel a booking
2. Click "Cancelled Tickets" button
3. Verify cancelled booking shows
4. Check refund amount displays
5. Verify cancellation reason shows

### Test MongoDB Integration:
1. Book flight with meals
2. Check MongoDB for meal data
3. Cancel booking
4. Check MongoDB for cancellation data
5. Refresh page
6. Verify data persists

---

## 🚀 NEXT STEPS

I'll now implement these fixes:
1. Update Home.jsx to display meal data
2. Add cancelled bookings section
3. Update booking service to save meal data
4. Test all changes

Ready to proceed?
