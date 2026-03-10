// Test script to verify login endpoints are working
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api';

async function testUserLogin() {
  console.log('\n🧪 Testing User Login Endpoint...');
  try {
    const response = await fetch(`${API_BASE}/user-auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@test.com',
        password: 'test123'
      })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
    
    if (response.status === 401) {
      console.log('✅ Endpoint working (user not found is expected)');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function testAdminLogin() {
  console.log('\n🧪 Testing Admin Login Endpoint...');
  try {
    const response = await fetch(`${API_BASE}/admin-auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password: '7013367409'
      })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.status === 200 && data.status === 'success') {
      console.log('✅ Admin login successful!');
      console.log('Session Token:', data.data.sessionToken.substring(0, 20) + '...');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Login Endpoint Tests...');
  await testUserLogin();
  await testAdminLogin();
  console.log('\n✅ Tests complete!');
}

runTests();
