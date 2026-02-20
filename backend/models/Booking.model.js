import mongoose from 'mongoose';

const passengerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 120
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  nationality: {
    type: String,
    required: true,
    trim: true
  },
  passportNumber: {
    type: String,
    trim: true
  },
  seatNumber: {
    type: String,
    trim: true
  },
  mealPreference: {
    type: String,
    enum: ['vegetarian', 'non-vegetarian', 'vegan', 'no-preference'],
    default: 'no-preference'
  }
});

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  flight: {
    flightId: { type: String, required: true },
    airline: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    departure: { type: String, required: true },
    arrival: { type: String, required: true },
    departureDate: { type: Date, required: true },
    aircraft: { type: String, required: true },
    class: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: String, required: true }
  },
  passengers: {
    type: [passengerSchema],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one passenger is required'
    }
  },
  seats: [{
    seatNumber: String,
    passengerIndex: Number,
    class: String
  }],
  contactDetails: {
    email: {
      type: String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
    }
  },
  pricing: {
    basePrice: { type: Number, required: true },
    taxes: { type: Number, default: 0 },
    fees: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true }
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed', 'pending'],
    default: 'confirmed',
    index: true
  },
  cancellation: {
    isCancelled: { type: Boolean, default: false },
    cancelledAt: Date,
    cancellationReason: String,
    refundAmount: Number,
    refundStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    },
    refundDate: Date
  },
  specialRequests: {
    type: String,
    maxlength: 500
  },
  bookingDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  travelDate: {
    type: Date,
    required: true,
    index: true
  },
  pnr: {
    type: String,
    unique: true,
    sparse: true
  },
  eTicketNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  notifications: {
    emailSent: { type: Boolean, default: false },
    smsSent: { type: Boolean, default: false },
    reminderSent: { type: Boolean, default: false }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
bookingSchema.index({ user: 1, bookingDate: -1 });
bookingSchema.index({ 'flight.airline': 1 });
bookingSchema.index({ 'flight.from': 1, 'flight.to': 1 });
bookingSchema.index({ status: 1, bookingDate: -1 });
bookingSchema.index({ travelDate: 1 }, { unique: false });

// Generate unique booking ID before saving
bookingSchema.pre('save', async function(next) {
  if (!this.bookingId) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    this.bookingId = `BK${timestamp}${random}`;
  }
  
  // Generate PNR if not exists
  if (!this.pnr && this.status === 'confirmed') {
    this.pnr = `PNR${Date.now()}${Math.floor(Math.random() * 10000)}`;
  }
  
  // Generate e-ticket number if not exists
  if (!this.eTicketNumber && this.status === 'confirmed') {
    this.eTicketNumber = `ET${Date.now()}${Math.floor(Math.random() * 10000)}`;
  }
  
  next();
});

// Virtual for days until travel
bookingSchema.virtual('daysUntilTravel').get(function() {
  const now = new Date();
  const travel = new Date(this.travelDate);
  const diffTime = travel - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for cancellation eligibility
bookingSchema.virtual('canCancel').get(function() {
  if (this.status === 'cancelled' || this.status === 'completed') {
    return false;
  }
  
  const now = new Date();
  const travel = new Date(this.travelDate);
  const hoursUntilTravel = (travel - now) / (1000 * 60 * 60);
  
  // Can cancel if more than 2 hours before travel
  return hoursUntilTravel > 2;
});

// Method to calculate refund amount
bookingSchema.methods.calculateRefund = function() {
  if (!this.canCancel) {
    return 0;
  }
  
  const bookingDate = new Date(this.bookingDate);
  const now = new Date();
  const daysFromBooking = (now - bookingDate) / (1000 * 60 * 60 * 24);
  
  let refundPercentage = 0;
  
  // 10-day guarantee: 100% refund
  if (daysFromBooking <= 10) {
    refundPercentage = 100;
  }
  // 11-30 days: 75% refund
  else if (daysFromBooking <= 30) {
    refundPercentage = 75;
  }
  // 31-60 days: 50% refund
  else if (daysFromBooking <= 60) {
    refundPercentage = 50;
  }
  // More than 60 days: 25% refund
  else {
    refundPercentage = 25;
  }
  
  return Math.round((this.pricing.totalPrice * refundPercentage) / 100);
};

// Method to cancel booking
bookingSchema.methods.cancelBooking = async function(reason) {
  if (!this.canCancel) {
    throw new Error('Booking cannot be cancelled');
  }
  
  this.status = 'cancelled';
  this.cancellation.isCancelled = true;
  this.cancellation.cancelledAt = new Date();
  this.cancellation.cancellationReason = reason;
  this.cancellation.refundAmount = this.calculateRefund();
  this.cancellation.refundStatus = 'processing';
  
  return await this.save();
};

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
