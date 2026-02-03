# Authentication Flow - Business Flight Direct

## 🔐 How Login & Signup Works

### **Signup Process:**
1. **Navigate to Signup**: Click "Sign Up" from login page or go to `/signup`
2. **Fill Details**: Enter all required information:
   - Username
   - Email
   - Password (must have uppercase, lowercase, special character, 8+ chars)
   - Confirm Password
   - Mobile Number
   - Age
   - Date of Birth
3. **Submit**: Click "Sign Up →"
4. **Data Storage**: 
   - Full signup data saved to `localStorage.signupUser`
   - User session data saved to `localStorage.user`
   - Login flag set to `localStorage.isLoggedIn = true`
5. **Redirect**: Automatically redirected to Home page

### **Login Process:**
1. **Navigate to Login**: Go to `/` (root) or click "Login" from signup
2. **Enter Credentials**: Use the SAME details from signup:
   - Username
   - Password  
   - Age
3. **Validation**: System checks against stored signup data
4. **Success**: If credentials match:
   - User session data updated in `localStorage.user`
   - Login flag set to `localStorage.isLoggedIn = true`
   - Redirected to Home page
5. **Failure**: Error message shown for invalid credentials

### **Data Storage Structure:**

**localStorage.signupUser** (Full signup data):
```json
{
  "username": "john_doe",
  "email": "john@example.com", 
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "mobile": "9876543210",
  "age": "25",
  "dob": "1999-01-15"
}
```

**localStorage.user** (Session data for Home page):
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "age": "25", 
  "role": "Customer",
  "loginTime": "1/29/2026, 3:45:23 PM"
}
```

### **Protected Routes:**
- Home page (`/home`) requires authentication
- If not logged in, automatically redirected to login page
- Dashboard shows user details from `localStorage.user`

### **Testing Steps:**
1. **First Time**: Go to signup, create account → Auto login to home
2. **Return Visit**: Go to login, use same credentials → Login to home
3. **Logout**: Click "Sign Out" → Clears storage, returns to login

### **Security Features:**
- Password validation (uppercase, lowercase, special chars, 8+ length)
- Email format validation
- Form validation with error messages
- Protected routes with authentication checks
- Secure data storage in localStorage

### **User Experience:**
- Toast notifications for success/error messages
- Smooth navigation between pages
- Responsive design for all devices
- Clear error messages for validation
- Demo credentials helper on login page