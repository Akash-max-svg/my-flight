import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('\n🔍 Testing MongoDB Atlas Connection...\n');
console.log('📍 Your IP Address: 61.3.117.22');
console.log('🔗 Connection String:', process.env.MONGODB_URI?.replace(/:[^:]*@/, ':****@'));
console.log('\n⏳ Attempting to connect...\n');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ SUCCESS! MongoDB Connected!');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
    console.log('\n🎉 Your backend should work now!');
    console.log('👉 Check your backend terminal - it should auto-restart\n');
    process.exit(0);
  })
  .catch((error) => {
    console.log('❌ CONNECTION FAILED!\n');
    console.log('Error:', error.message);
    console.log('\n📋 Troubleshooting Steps:\n');
    console.log('1. Go to: https://cloud.mongodb.com/');
    console.log('2. Click "Network Access" (left sidebar)');
    console.log('3. Click "ADD IP ADDRESS"');
    console.log('4. Add IP: 61.3.117.22');
    console.log('   OR click "ALLOW ACCESS FROM ANYWHERE" (0.0.0.0/0)');
    console.log('5. Wait 2-3 minutes for changes to apply');
    console.log('6. Run this test again: node quick-test.js\n');
    process.exit(1);
  });

// Timeout after 10 seconds
setTimeout(() => {
  console.log('⏱️ Connection timeout - taking too long');
  console.log('This usually means your IP is not whitelisted\n');
  process.exit(1);
}, 10000);
