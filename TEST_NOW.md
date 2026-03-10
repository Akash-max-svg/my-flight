# 🧪 Test Your Application Now!

## ✅ Servers Running

- **Frontend:** http://localhost:5173/
- **Backend:** http://localhost:5000
- **MongoDB:** Connected ✅

## 🎯 Quick Tests

### 1. Open Application
```
http://localhost:5173/
```

You should see the home page with flight search.

### 2. Test Signup
1. Click "Login/Signup" button
2. Click "Sign Up" tab
3. Fill in details:
   - Username: testuser
   - Email: test@example.com
   - Password: Test@123
   - Age: 25
   - Gender: Male
   - Mobile: 1234567890
   - Country: India
4. Click "Sign Up"
5. Should redirect to home with username showing

### 3. Test Login
1. Go to http://localhost:5173/login
2. Enter email and password
3. Click "Login"
4. Should show username in navbar

### 4. Test Google OAuth
1. Go to http://localhost:5173/login
2. Click "Continue with Google" button
3. Login with your Google account
4. Should redirect to home
5. Should show your Google name in navbar

### 5. Test Flight Search
1. On home page, enter:
   - From: Delhi
   - To: Mumbai
   - Date: Any future date
2. Click "Search Flights"
3. Should show flight results from Amadeus API

### 6. Test Booking
1. Search for flights
2. Click "Book Now" on any flight
3. Fill passenger details
4. Click "Confirm Booking"
5. Should show booking confirmation
6. Check your email for ticket PDF

### 7. Test Admin Dashboard
1. Go to http://localhost:5173/login
2. Scroll down to "Admin Login" section (red box)
3. Enter password: `7013367409`
4. Click "Admin Login"
5. Should show admin dashboard with:
   - Total users
   - Total bookings
   - User list
   - Booking list

## 🔍 Debug Console (If Issues)

Open browser console (F12) and run:

```javascript
// Check if user is logged in
console.log('User:', localStorage.getItem('user'));
console.log('Login Status:', localStorage.getItem('isLoggedIn'));

// Test backend
fetch('http://localhost:5000/health')
  .then(r => r.json())
  .then(d => console.log('Backend:', d))
  .catch(e => console.error('Backend Error:', e));
```

## ✅ Expected Results

### After Signup/Login:
- ✅ Username shows in top-right corner
- ✅ User dropdown menu appears
- ✅ Can view profile
- ✅ Can logout

### After Google OAuth:
- ✅ Google name shows in navbar
- ✅ Google profile picture (if available)
- ✅ User data saved to MongoDB
- ✅ Can book flights

### After Booking:
- ✅ Booking saved to MongoDB
- ✅ Email sent with PDF ticket
- ✅ Can view booking in "My Bookings"
- ✅ Can cancel booking (if >48 hours before flight)

### Admin Dashboard:
- ✅ Shows total users count
- ✅ Shows total bookings count
- ✅ Lists all users with details
- ✅ Lists all bookings with details
- ✅ Can search users/bookings

## 🐛 If Something Doesn't Work

### User not showing after login:
```javascript
// Force reload
localStorage.clear();
window.location.reload();
// Then login again
```

### Backend not responding:
Check backend terminal for errors

### MongoDB not saving:
Check backend logs for MongoDB errors

### Email not sending:
Check backend/.env for EMAIL_USER and EMAIL_PASSWORD

## 📝 Test Checklist

- [ ] Home page loads
- [ ] Can signup new user
- [ ] Can login with email/password
- [ ] Username shows in navbar after login
- [ ] Can login with Google OAuth
- [ ] Google name shows in navbar
- [ ] Can search flights
- [ ] Flight results appear
- [ ] Can book a flight
- [ ] Booking confirmation shows
- [ ] Email received with ticket
- [ ] Can view "My Bookings"
- [ ] Can access admin dashboard
- [ ] Admin shows users and bookings

---

**Start Testing:** http://localhost:5173/
**Backend Health:** http://localhost:5000/health
**Admin Password:** 7013367409
