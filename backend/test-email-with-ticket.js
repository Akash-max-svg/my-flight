import dotenv from 'dotenv';
import { sendBookingConfirmation } from './services/email.service.js';

dotenv.config();

console.log('🧪 Testing Email with PDF Ticket Feature...\n');

// Check email configuration
console.log('📧 Email Configuration:');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Not set');
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ Set' : '❌ Not set');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST || 'smtp.gmail.com (default)');
console.log('EMAIL_PORT:', process.env.EMAIL_PORT || '587 (default)');
console.log('');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.error('❌ Email not configured! Please set EMAIL_USER and EMAIL_PASSWORD in .env file');
  process.exit(1);
}

// Create test booking data
const testBooking = {
  _id: '507f1f77bcf86cd799439011',
  bookingId: 'BK1234567890',
  bookingDate: new Date(),
  totalPrice: 45000,
  status: 'confirmed',
  flight: {
    from: 'Delhi',
    to: 'Dubai',
    airline: 'Emirates',
    aircraft: 'Boeing 777',
    class: 'Business',
    departure: '14:30',
    arrival: '17:45',
    time: '3h 15m',
    departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    arrivalDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3.25 * 60 * 60 * 1000)
  },
  passengers: [
    {
      firstName: 'John',
      lastName: 'Doe',
      age: 35,
      gender: 'male',
      seatNumber: '12A'
    },
    {
      firstName: 'Jane',
      lastName: 'Doe',
      age: 32,
      gender: 'female',
      seatNumber: '12B'
    }
  ]
};

// Create confirmation data
const confirmationData = {
  confirmationNumber: `BF${Date.now().toString().slice(-6)}`,
  eTicketNumber: `ET${Math.floor(Math.random() * 1000000000)}`,
  confirmationDate: new Date().toISOString()
};

console.log('📋 Test Booking Details:');
console.log('Booking ID:', testBooking.bookingId);
console.log('Route:', `${testBooking.flight.from} → ${testBooking.flight.to}`);
console.log('Airline:', testBooking.flight.airline);
console.log('Passengers:', testBooking.passengers.length);
console.log('');

console.log('🎫 Confirmation Details:');
console.log('Confirmation Number:', confirmationData.confirmationNumber);
console.log('E-Ticket Number:', confirmationData.eTicketNumber);
console.log('');

console.log('📤 Sending test email with PDF ticket...');
console.log('Recipient:', process.env.EMAIL_USER);
console.log('');

try {
  const result = await sendBookingConfirmation(testBooking, process.env.EMAIL_USER, confirmationData);
  
  if (result) {
    console.log('✅ SUCCESS! Email sent with PDF ticket attachment');
    console.log('');
    console.log('📥 Check your email inbox for:');
    console.log('  1. PDF ticket attachment');
    console.log('  2. Download button (green)');
    console.log('  3. View booking button (purple)');
    console.log('  4. Complete flight details');
    console.log('  5. Passenger information');
    console.log('');
    console.log('💡 If you don\'t see the email:');
    console.log('  - Check spam/junk folder');
    console.log('  - Verify email credentials in .env');
    console.log('  - Check backend console for errors');
  } else {
    console.error('❌ FAILED! Email was not sent');
    console.log('');
    console.log('🔍 Troubleshooting:');
    console.log('  1. Check EMAIL_USER and EMAIL_PASSWORD in .env');
    console.log('  2. For Gmail, use App Password (not regular password)');
    console.log('  3. Check backend console for detailed error messages');
    console.log('  4. Verify SMTP settings are correct');
  }
} catch (error) {
  console.error('❌ ERROR:', error.message);
  console.error('');
  console.error('Stack trace:', error.stack);
}

process.exit(0);
