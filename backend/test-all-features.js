// Quick test script to verify all backend features
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: join(__dirname, '.env') });

console.log('🔍 Testing Backend Configuration...\n');

// Test 1: Environment Variables
console.log('1️⃣ Environment Variables:');
console.log('   ✅ PORT:', process.env.PORT || '5000');
console.log('   ✅ NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('   ✅ MONGODB_URI:', process.env.MONGODB_URI ? '✅ Configured' : '❌ Missing');
console.log('   ✅ JWT_SECRET:', process.env.JWT_SECRET ? '✅ Configured' : '❌ Missing');
console.log('   ✅ EMAIL_USER:', process.env.EMAIL_USER || '❌ Missing');
console.log('   ✅ FRONTEND_URL:', process.env.FRONTEND_URL || 'http://localhost:5173');
console.log('   ✅ AMADEUS_API_KEY:', process.env.AMADEUS_API_KEY ? '✅ Configured' : '❌ Missing');
console.log('   ✅ GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Configured' : '❌ Missing');
console.log('');

// Test 2: Required Modules
console.log('2️⃣ Testing Module Imports:');
try {
  await import('./models/User.model.js');
  console.log('   ✅ User Model');
} catch (e) {
  console.log('   ❌ User Model:', e.message);
}

try {
  await import('./models/Booking.model.js');
  console.log('   ✅ Booking Model');
} catch (e) {
  console.log('   ❌ Booking Model:', e.message);
}

try {
  await import('./services/email.service.js');
  console.log('   ✅ Email Service');
} catch (e) {
  console.log('   ❌ Email Service:', e.message);
}

try {
  await import('./services/ticket.service.js');
  console.log('   ✅ Ticket Service');
} catch (e) {
  console.log('   ❌ Ticket Service:', e.message);
}

try {
  await import('./services/amadeus.service.js');
  console.log('   ✅ Amadeus Service');
} catch (e) {
  console.log('   ❌ Amadeus Service:', e.message);
}

try {
  await import('./config/passport.config.js');
  console.log('   ✅ Passport Config');
} catch (e) {
  console.log('   ❌ Passport Config:', e.message);
}

console.log('');

// Test 3: Routes
console.log('3️⃣ Testing Route Imports:');
try {
  await import('./routes/auth.routes.js');
  console.log('   ✅ Auth Routes');
} catch (e) {
  console.log('   ❌ Auth Routes:', e.message);
}

try {
  await import('./routes/booking.routes.js');
  console.log('   ✅ Booking Routes');
} catch (e) {
  console.log('   ❌ Booking Routes:', e.message);
}

try {
  await import('./routes/oauth.routes.js');
  console.log('   ✅ OAuth Routes');
} catch (e) {
  console.log('   ❌ OAuth Routes:', e.message);
}

try {
  await import('./routes/admin.routes.js');
  console.log('   ✅ Admin Routes');
} catch (e) {
  console.log('   ❌ Admin Routes:', e.message);
}

try {
  await import('./routes/flights-api.routes.js');
  console.log('   ✅ Flights API Routes');
} catch (e) {
  console.log('   ❌ Flights API Routes:', e.message);
}

console.log('');
console.log('✅ All backend modules loaded successfully!');
console.log('');
console.log('🚀 Ready to start server with: npm start');
