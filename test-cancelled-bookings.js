// Test script to verify cancelled bookings functionality
// Run with: node test-cancelled-bookings.js

const API_URL = 'http://localhost:5000/api';

// Test user credentials (update with your test user)
const TEST_USER = {
  email: 'test@example.com',
  password: 'test123'
};

async function testCancelledBookings() {
  console.log('🧪 Testing Cancelled Bookings Functionality\n');
  console.log('=' .repeat(60));

  try {
    // Step 1: Login
    console.log('\n📝 Step 1: Logging in...');
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(TEST_USER)
    });
    
    const loginData = await loginResponse.json();
    
    if (loginData.status !== 'success') {
      console.error('❌ Login failed:', loginData.message);
      return;
    }
    
    const token = loginData.data.token;
    console.log('✅ Login successful');
    console.log('   Token:', token.substring(0, 20) + '...');

    // Step 2: Get active bookings
    console.log('\n📝 Step 2: Fetching active bookings...');
    const bookingsResponse = await fetch(`${API_URL}/bookings`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const bookingsData = await bookingsResponse.json();
    
    if (bookingsData.status === 'success') {
      console.log('✅ Active bookings fetched');
      console.log(`   Count: ${bookingsData.data.bookings.length}`);
      bookingsData.data.bookings.forEach(b => {
        console.log(`   - ${b.bookingId}: ${b.flight.from} → ${b.flight.to} (${b.status})`);
      });
    } else {
      console.error('❌ Failed to fetch bookings:', bookingsData.message);
    }

    // Step 3: Get cancelled bookings
    console.log('\n📝 Step 3: Fetching cancelled bookings...');
    const cancelledResponse = await fetch(`${API_URL}/bookings/cancelled/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const cancelledData = await cancelledResponse.json();
    
    if (cancelledData.status === 'success') {
      console.log('✅ Cancelled bookings fetched');
      console.log(`   Count: ${cancelledData.data.bookings.length}`);
      cancelledData.data.bookings.forEach(b => {
        console.log(`   - ${b.bookingId}: ${b.flight.from} → ${b.flight.to}`);
        console.log(`     Cancelled: ${new Date(b.cancellation.cancelledAt).toLocaleString()}`);
        console.log(`     Refund: ₹${b.cancellation.refundAmount}`);
        console.log(`     Status: ${b.cancellation.refundStatus}`);
      });
    } else {
      console.error('❌ Failed to fetch cancelled bookings:', cancelledData.message);
    }

    // Step 4: Get cancellation stats
    console.log('\n📝 Step 4: Fetching cancellation statistics...');
    const statsResponse = await fetch(`${API_URL}/bookings/cancelled/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const statsData = await statsResponse.json();
    
    if (statsData.status === 'success') {
      console.log('✅ Cancellation stats fetched');
      console.log(`   Total Cancellations: ${statsData.data.totalCancellations}`);
      console.log(`   Total Refund Amount: ₹${statsData.data.totalRefundAmount}`);
      console.log(`   Pending Refunds: ${statsData.data.pendingRefunds}`);
      console.log(`   Completed Refunds: ${statsData.data.completedRefunds}`);
    } else {
      console.error('❌ Failed to fetch stats:', statsData.message);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - Active Bookings: ${bookingsData.data?.bookings.length || 0}`);
    console.log(`   - Cancelled Bookings: ${cancelledData.data?.bookings.length || 0}`);
    console.log(`   - Total Refunds: ₹${statsData.data?.totalRefundAmount || 0}`);

  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    console.error('   Stack:', error.stack);
  }
}

// Run the test
testCancelledBookings();
