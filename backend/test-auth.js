// Test authentication endpoints
const API_URL = 'http://localhost:5000/api';

async function testUserLogin() {
  console.log('\n🔐 Testing User Login...');
  try {
    const response = await fetch(`${API_URL}/user-auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'Test@123'
      })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ User login working');
      return data.data?.token;
    } else {
      console.log('❌ User login failed:', data.message);
    }
  } catch (error) {
    console.log('❌ User login error:', error.message);
  }
  return null;
}

async function testAdminLogin() {
  console.log('\n🔐 Testing Admin Login...');
  try {
    const response = await fetch(`${API_URL}/admin-auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password: '7013367409'
      })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ Admin login working');
      return data.data?.sessionToken;
    } else {
      console.log('❌ Admin login failed:', data.message);
    }
  } catch (error) {
    console.log('❌ Admin login error:', error.message);
  }
  return null;
}

async function testPasswordReset() {
  console.log('\n🔐 Testing Password Reset (Direct)...');
  try {
    const response = await fetch(`${API_URL}/password-reset/reset-password-direct`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        newPassword: 'NewTest@123'
      })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ Password reset working');
    } else {
      console.log('❌ Password reset failed:', data.message);
    }
  } catch (error) {
    console.log('❌ Password reset error:', error.message);
  }
}

async function testUserRegister() {
  console.log('\n🔐 Testing User Registration...');
  try {
    const response = await fetch(`${API_URL}/user-auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test@123',
        age: 25,
        gender: 'male',
        mobile: '1234567890',
        country: 'India',
        dob: '1999-01-01'
      })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ User registration working');
    } else {
      console.log('❌ User registration failed:', data.message);
    }
  } catch (error) {
    console.log('❌ User registration error:', error.message);
  }
}

async function runTests() {
  console.log('🧪 Starting Authentication Tests...');
  console.log('=====================================');
  
  // Test user registration first
  await testUserRegister();
  
  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test user login
  await testUserLogin();
  
  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test admin login
  await testAdminLogin();
  
  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test password reset
  await testPasswordReset();
  
  console.log('\n=====================================');
  console.log('✅ Tests completed');
  process.exit(0);
}

runTests();
