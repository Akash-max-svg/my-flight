import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.model.js';

dotenv.config();

async function setupAdmin() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if admin exists
    console.log('🔍 Checking for existing admin...');
    let admin = await Admin.findOne({ username: 'admin' }).select('+password');

    if (admin) {
      console.log('✅ Admin already exists');
      console.log('   Username:', admin.username);
      console.log('   Email:', admin.email);
      console.log('   Role:', admin.role);
      console.log('   Active Sessions:', admin.sessions.filter(s => s.isActive && s.expiresAt > new Date()).length);
      
      // Test password
      console.log('\n🔐 Testing password...');
      const testPassword = '7013367409';
      const isMatch = await admin.comparePassword(testPassword);
      
      if (isMatch) {
        console.log('✅ Password test PASSED - Admin can login with:', testPassword);
      } else {
        console.log('❌ Password test FAILED - Resetting password...');
        admin.password = testPassword;
        await admin.save();
        console.log('✅ Password reset to:', testPassword);
      }
    } else {
      console.log('⚠️  Admin does not exist. Creating...');
      
      admin = new Admin({
        username: 'admin',
        password: '7013367409',
        email: 'admin@flightbooking.com',
        role: 'superadmin',
        permissions: [
          'view_users',
          'edit_users',
          'delete_users',
          'view_bookings',
          'edit_bookings',
          'delete_bookings',
          'view_stats',
          'manage_settings'
        ]
      });
      
      await admin.save();
      console.log('✅ Admin created successfully!');
      console.log('   Username: admin');
      console.log('   Password: 7013367409');
      console.log('   Email: admin@flightbooking.com');
    }

    console.log('\n📊 Admin Summary:');
    console.log('   Username:', admin.username);
    console.log('   Email:', admin.email);
    console.log('   Role:', admin.role);
    console.log('   Permissions:', admin.permissions.length);
    console.log('   Is Active:', admin.isActive);
    console.log('   Total Login History:', admin.loginHistory.length);
    console.log('   Active Sessions:', admin.sessions.filter(s => s.isActive && s.expiresAt > new Date()).length);

    console.log('\n✅ Admin setup complete!');
    console.log('\n🔐 Login Credentials:');
    console.log('   URL: http://localhost:5174/admin');
    console.log('   Password: 7013367409');

    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

setupAdmin();
