# 📋 Feature Status & Implementation Plan

## ✅ Currently Working Features

### 1. Ticket Download ✅ WORKING
**Status:** Fully implemented and functional

**Features:**
- PDF ticket generation with PDFKit
- Modern gradient design
- QR code and barcode
- Download button on confirmation page
- Email attachment with ticket

**Files:**
- `backend/services/ticket.service.js` - PDF generation
- `src/Components/BookingConfirmation.jsx` - Download button
- `backend/routes/booking.routes.js` - Download endpoint

**Test:**
1. Book a flight
2. Go to confirmation page
3. Click "📄 Download E-Ticket"
4. PDF should download

---

### 2. Meals Feature ✅ PARTIALLY IMPLEMENTED
**Status:** Backend ready, frontend needs UI

**What's Working:**
- ✅ Meal model (`backend/models/Meal.model.js`)
- ✅ Meal service (`backend/services/meal.service.js`)
- ✅ Meal booking schema in Booking model
- ✅ `mealBookings` array field
- ✅ `mealTotalPrice` field

**What's Missing:**
- ❌ Meal selection UI in booking flow
- ❌ Meal menu display
- ❌ Add to cart functionality
- ❌ Meal summary in confirmation

**Implementation Needed:**
- Add meal selection step in `src/Components/Booking.jsx`
- Create meal menu component
- Integrate with booking flow

---

## ❌ Missing Features (Need Implementation)

### 3. Payment Gateway ❌ NOT IMPLEMENTED
**Status:** Removed previously, needs to be added

**Required Payment Methods:**
1. UPI (PhonePe, Google Pay, Paytm, etc.)
2. Net Banking (All major banks)
3. Debit Card (Visa, Mastercard, RuPay)
4. Credit Card (Visa, Mastercard, Amex)
5. Wallets (Paytm, PhonePe, etc.)

**Recommended Solution:** Razorpay or Stripe

**Implementation Steps:**
1. Choose payment gateway (Razorpay recommended for India)
2. Get API credentials
3. Install SDK
4. Create payment routes
5. Add payment UI
6. Handle payment callbacks
7. Update booking status

**Estimated Time:** 4-6 hours

---

### 4. Login Success Email ❌ NOT IMPLEMENTED
**Status:** Email system exists, just need to add login email

**Required:**
- Send email when user logs in successfully
- Include login time, device info, location
- Security alert feature

**Implementation Steps:**
1. Add email template for login success
2. Update auth controller to send email
3. Add email sending after successful login
4. Include login details in email

**Estimated Time:** 1-2 hours

---

## 📊 Feature Implementation Priority

### High Priority (Must Have)
1. **Payment Gateway** - Critical for production
2. **Meal Selection UI** - Backend ready, just needs frontend
3. **Login Success Email** - Security and user experience

### Medium Priority (Should Have)
- Payment confirmation email
- Payment receipt generation
- Meal customization options

### Low Priority (Nice to Have)
- Multiple payment method support
- Saved payment methods
- Payment history

---

## 🎯 Detailed Implementation Plans

### Plan 1: Add Payment Gateway (Razorpay)

#### Step 1: Setup Razorpay Account
1. Go to https://razorpay.com/
2. Sign up for account
3. Get API Key and Secret
4. Add to `backend/.env`:
```env
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

#### Step 2: Install Dependencies
```bash
cd backend
npm install razorpay

cd ..
npm install react-razorpay
```

#### Step 3: Create Payment Service
**File:** `backend/services/payment.service.js`
```javascript
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createPaymentOrder = async (amount, currency = 'INR') => {
  const options = {
    amount: amount * 100, // Amount in paise
    currency,
    receipt: `receipt_${Date.now()}`
  };
  
  return await razorpay.orders.create(options);
};

export const verifyPayment = (orderId, paymentId, signature) => {
  const crypto = require('crypto');
  const text = orderId + '|' + paymentId;
  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(text)
    .digest('hex');
  
  return generated_signature === signature;
};
```

#### Step 4: Create Payment Routes
**File:** `backend/routes/payment.routes.js`
```javascript
import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { createPaymentOrder, verifyPayment } from '../services/payment.service.js';

const router = express.Router();

// Create payment order
router.post('/create-order', protect, async (req, res) => {
  try {
    const { amount } = req.body;
    const order = await createPaymentOrder(amount);
    
    res.json({
      status: 'success',
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Verify payment
router.post('/verify', protect, async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    const isValid = verifyPayment(orderId, paymentId, signature);
    
    if (isValid) {
      // Update booking status to confirmed
      res.json({
        status: 'success',
        message: 'Payment verified successfully'
      });
    } else {
      res.status(400).json({
        status: 'error',
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;
```

#### Step 5: Add Payment UI
**File:** `src/Components/Payment.jsx` (Create new)
```jsx
import { useState } from 'react';
import { toast } from 'react-toastify';

function Payment({ bookingData, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Create order
      const response = await fetch('http://localhost:5000/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: bookingData.totalPrice
        })
      });
      
      const { data } = await response.json();
      
      // Open Razorpay checkout
      const options = {
        key: 'YOUR_RAZORPAY_KEY_ID',
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Flight Booking',
        description: 'Flight Ticket Payment',
        order_id: data.order.id,
        handler: async function (response) {
          // Verify payment
          const verifyResponse = await fetch('http://localhost:5000/api/payment/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              orderId: data.order.id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            })
          });
          
          if (verifyResponse.ok) {
            toast.success('Payment successful!');
            onSuccess();
          }
        },
        prefill: {
          name: bookingData.passengerName,
          email: bookingData.email,
          contact: bookingData.phone
        },
        theme: {
          color: '#667eea'
        }
      };
      
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <h3>Payment</h3>
      <div className="payment-summary">
        <p>Total Amount: ₹{bookingData.totalPrice}</p>
      </div>
      <button 
        onClick={handlePayment}
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
}

export default Payment;
```

#### Step 6: Update Booking Model
Add payment field to `backend/models/Booking.model.js`:
```javascript
payment: {
  method: {
    type: String,
    enum: ['upi', 'netbanking', 'debit_card', 'credit_card', 'wallet'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: String,
  orderId: String,
  paymentId: String,
  amount: Number,
  currency: {
    type: String,
    default: 'INR'
  },
  paidAt: Date
}
```

---

### Plan 2: Add Meal Selection UI

#### Step 1: Create Meal Menu Component
**File:** `src/Components/MealSelection.jsx` (Create new)
```jsx
import { useState } from 'react';
import { toast } from 'react-toastify';

const mealOptions = [
  {
    id: 1,
    name: 'Vegetarian Meal',
    description: 'Fresh vegetables with rice',
    price: 250,
    image: '🥗',
    category: 'vegetarian'
  },
  {
    id: 2,
    name: 'Non-Vegetarian Meal',
    description: 'Chicken with rice',
    price: 350,
    image: '🍗',
    category: 'non-vegetarian'
  },
  {
    id: 3,
    name: 'Vegan Meal',
    description: 'Plant-based meal',
    price: 300,
    image: '🥙',
    category: 'vegan'
  }
];

function MealSelection({ passengers, onMealSelect }) {
  const [selectedMeals, setSelectedMeals] = useState({});

  const handleMealSelect = (passengerIndex, mealId) => {
    const meal = mealOptions.find(m => m.id === mealId);
    setSelectedMeals({
      ...selectedMeals,
      [passengerIndex]: meal
    });
  };

  const handleContinue = () => {
    onMealSelect(selectedMeals);
  };

  return (
    <div className="meal-selection">
      <h3>Select Meals</h3>
      {passengers.map((passenger, index) => (
        <div key={index} className="passenger-meal">
          <h5>{passenger.firstName} {passenger.lastName}</h5>
          <div className="meal-options">
            {mealOptions.map(meal => (
              <div 
                key={meal.id}
                className={`meal-card ${selectedMeals[index]?.id === meal.id ? 'selected' : ''}`}
                onClick={() => handleMealSelect(index, meal.id)}
              >
                <div className="meal-icon">{meal.image}</div>
                <h6>{meal.name}</h6>
                <p>{meal.description}</p>
                <p className="price">₹{meal.price}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
      <button onClick={handleContinue} className="btn btn-primary">
        Continue to Payment
      </button>
    </div>
  );
}

export default MealSelection;
```

#### Step 2: Integrate into Booking Flow
Update `src/Components/Booking.jsx` to include meal selection step

---

### Plan 3: Add Login Success Email

#### Step 1: Create Email Template
**File:** `backend/services/email.service.js`

Add this function:
```javascript
export const sendLoginSuccessEmail = async (user, loginDetails) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log('📧 Email not configured - skipping login email');
      return false;
    }

    const mailOptions = {
      from: `"Flight Booking" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '✅ Login Successful - Flight Booking',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">Login Successful</h2>
          <p>Hello ${user.username},</p>
          <p>You have successfully logged in to your Flight Booking account.</p>
          
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Login Details:</h3>
            <p><strong>Time:</strong> ${loginDetails.time}</p>
            <p><strong>Device:</strong> ${loginDetails.device}</p>
            <p><strong>IP Address:</strong> ${loginDetails.ip}</p>
            <p><strong>Location:</strong> ${loginDetails.location || 'Unknown'}</p>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            If this wasn't you, please secure your account immediately by changing your password.
          </p>
          
          <p>Thank you for using Flight Booking!</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Login success email sent to:', user.email);
    return true;
  } catch (error) {
    console.error('❌ Error sending login email:', error);
    return false;
  }
};
```

#### Step 2: Update Auth Controller
**File:** `backend/controllers/auth.controller.js`

Add email sending after successful login:
```javascript
import { sendLoginSuccessEmail } from '../services/email.service.js';

// In login function, after successful authentication:
const loginDetails = {
  time: new Date().toLocaleString(),
  device: req.headers['user-agent'],
  ip: req.ip || req.connection.remoteAddress,
  location: 'India' // You can use IP geolocation service
};

// Send login success email (don't wait for it)
sendLoginSuccessEmail(user, loginDetails).catch(err => 
  console.error('Failed to send login email:', err)
);
```

---

## 📝 Implementation Checklist

### Payment Gateway
- [ ] Choose payment gateway (Razorpay/Stripe)
- [ ] Get API credentials
- [ ] Install dependencies
- [ ] Create payment service
- [ ] Create payment routes
- [ ] Add payment UI component
- [ ] Update booking model
- [ ] Test payment flow
- [ ] Add payment confirmation email

### Meal Selection
- [ ] Create meal menu component
- [ ] Add meal selection to booking flow
- [ ] Connect to backend meal service
- [ ] Update booking with meal data
- [ ] Show meals in confirmation
- [ ] Add meal prices to total

### Login Success Email
- [ ] Create email template
- [ ] Update auth controller
- [ ] Add login details collection
- [ ] Test email sending
- [ ] Add security alerts

---

## 🚀 Quick Start Guide

### To Add Payment Gateway:
1. Read: `SETUP_PAYMENT_GATEWAY.md` (will create)
2. Get Razorpay credentials
3. Follow implementation steps above
4. Test with test mode first

### To Add Meal Selection:
1. Use existing meal service
2. Create meal selection UI
3. Integrate into booking flow
4. Test end-to-end

### To Add Login Email:
1. Update email service
2. Update auth controller
3. Test email sending
4. Verify email content

---

**Estimated Total Time:** 6-10 hours for all features

**Priority Order:**
1. Login Success Email (1-2 hours) - Easiest
2. Meal Selection UI (2-3 hours) - Backend ready
3. Payment Gateway (4-6 hours) - Most complex

Would you like me to create detailed implementation guides for any of these features?
