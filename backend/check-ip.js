import https from 'https';

console.log('\n🔍 Checking your current IP address...\n');

// Get public IP
https.get('https://api.ipify.org?format=json', (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const ip = JSON.parse(data).ip;
      console.log('📍 Your Current Public IP Address:', ip);
      console.log('\n' + '='.repeat(60));
      console.log('🔐 MongoDB Atlas IP Whitelist Instructions');
      console.log('='.repeat(60));
      console.log('\n1. Go to: https://cloud.mongodb.com/');
      console.log('2. Sign in to your account');
      console.log('3. Click "Network Access" in the left sidebar');
      console.log('4. Click "Add IP Address" button');
      console.log('\n📋 Choose ONE of these options:');
      console.log('\n   Option A (Recommended for Development):');
      console.log('   - Click "Add Current IP Address"');
      console.log('   - It should auto-detect:', ip);
      console.log('\n   Option B (For Testing - Less Secure):');
      console.log('   - Click "Allow Access from Anywhere"');
      console.log('   - This adds 0.0.0.0/0 to whitelist');
      console.log('\n5. Click "Confirm"');
      console.log('6. Wait 1-2 minutes for changes to apply');
      console.log('\n✅ After whitelisting, your backend will auto-restart!\n');
    } catch (error) {
      console.error('Error parsing IP:', error.message);
    }
  });
}).on('error', (error) => {
  console.error('❌ Could not fetch IP:', error.message);
  console.log('\n📋 Manual Steps:');
  console.log('1. Go to: https://cloud.mongodb.com/');
  console.log('2. Click "Network Access" → "Add IP Address"');
  console.log('3. Click "Add Current IP Address" or "Allow Access from Anywhere"');
  console.log('4. Click "Confirm"\n');
});
