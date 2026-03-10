import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.model.js';
import Booking from './models/Booking.model.js';

dotenv.config();

async function testMongoDBData() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Test Users
    console.log('👥 Testing Users Collection:');
    const users = await User.find().select('+password').limit(5);
    console.log(`   Found ${users.length} users`);
    if (users.length > 0) {
      console.log('   Sample user:', {
        username: users[0].username,
        email: users[0].email,
        mobile: users[0].mobile,
        hasPassword: !!users[0].password
      });
    }
    console.log('');

    // Test Bookings
    console.log('✈️ Testing Bookings Collection:');
    const bookings = await Booking.find().limit(5);
    console.log(`   Found ${bookings.length} bookings`);
    if (bookings.length > 0) {
      console.log('   Sample booking:', {
        bookingId: bookings[0].bookingId,
        from: bookings[0].flight?.from,
        to: bookings[0].flight?.to,
        status: bookings[0].status
      });
    }
    console.log('');

    // Summary
    console.log('📊 Summary:');
    console.log(`   Total Users: ${users.length}`);
    console.log(`   Total Bookings: ${bookings.length}`);
    console.log('');

    if (users.length === 0 && bookings.length === 0) {
      console.log('⚠️  WARNING: No data found in MongoDB!');
      console.log('   This is why the admin dashboard is empty.');
      console.log('   You need to:');
      console.log('   1. Register some users at http://localhost:5173/signup');
      console.log('   2. Make some bookings at http://localhost:5173');
    } else {
      console.log('✅ MongoDB has data! Admin dashboard should display it.');
    }

    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testMongoDBData();
