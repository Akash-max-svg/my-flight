# 🔐 Complete OAuth Setup Guide - Google, Microsoft & Instagram

## 🎯 Two Options Available

### Option 1: Development Mode (Quick - 2 minutes) ✅
- Works immediately without OAuth credentials
- Perfect for testing and development
- Simulates OAuth login flow
- **I'll set this up for you now!**

### Option 2: Production Mode (30 minutes)
- Real OAuth with Google/Microsoft/Instagram
- Requires creating apps in developer consoles
- Full production-ready setup
- Follow detailed steps below

---

## 🚀 OPTION 1: Development Mode (RECOMMENDED FOR NOW)

I'm setting up a development mode that allows you to test OAuth functionality without real credentials.

### What I'm Doing:

1. **Creating Mock OAuth Mode**
   - Simulates Google/Microsoft/Instagram login
   - Works without real API credentials
   - Perfect for development and testing

2. **Adding Dev Mode Toggle**
   - Environment variable: `OAUTH_DEV_MODE=true`
   - Automatically creates test users
   - Bypasses real OAuth providers

3. **Test Accounts Created**
   - Google: test@gmail.com
   - Microsoft: test@outlook.com
   - Instagram: test@instagram.com

### How It Works:

When you click "Continue with Google" in dev mode:
1. Redirects to a simple confirmation page
2. Creates/logs in user with Google profile
3. Returns to your app with authentication
4. No real Google credentials needed!

---

## 📋 OPTION 2: Production OAuth Setup

If you want real OAuth later, follow these steps:

### 🔵 Google OAuth Setup (15 minutes)

#### Step 1: Create Google Cloud Project

1. Go to: https://console.cloud.google.com/
2. Click "Select a project" → "New Project"
3. Project name: "Flight Booking System"
4. Click "Create"

#### Step 2: Enable Google+ API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and click "Enable"

#### Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" (for testing)
3. Click "Create"
4. Fill in:
   - App name: `Flight Booking System`
   - User support email: `your-email@gmail.com`
   - Developer contact: `your-email@gmail.com`
5. Click "Save and Continue"
6. Scopes: Click "Add or Remove Scopes"
   - Select: `userinfo.email`
   - Select: `userinfo.profile`
7. Click "Save and Continue"
8. Test users: Add your email for testing
9. Click "Save and Continue"

#### Step 4: Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Application type: **Web application**
4. Name: `Flight Booking Web Client`
5. Authorized JavaScript origins:
   ```
   http://localhost:5174
   http://localhost:5173
   ```
6. Authorized redirect URIs:
   ```
   http://localhost:5000/api/auth/google/callback
   ```
7. Click "Create"
8. **Copy the Client ID and Client Secret**

#### Step 5: Update .env File

```env
GOOGLE_CLIENT_ID=your-actual-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-actual-secret-here
```

---

### 🔷 Microsoft OAuth Setup (15 minutes)

#### Step 1: Register Application

1. Go to: https://portal.azure.com/
2. Search for "Azure Active Directory"
3. Click "App registrations" → "New registration"
4. Fill in:
   - Name: `Flight Booking System`
   - Supported account types: **Accounts in any organizational directory and personal Microsoft accounts**
   - Redirect URI: 
     - Platform: **Web**
     - URI: `http://localhost:5000/api/auth/microsoft/callback`
5. Click "Register"

#### Step 2: Get Application ID

1. After registration, you'll see "Application (client) ID"
2. **Copy this ID** - this is your `MICROSOFT_CLIENT_ID`

#### Step 3: Create Client Secret

1. In your app, go to "Certificates & secrets"
2. Click "New client secret"
3. Description: `Flight Booking Secret`
4. Expires: Choose duration (e.g., 24 months)
5. Click "Add"
6. **Copy the Value immediately** - this is your `MICROSOFT_CLIENT_SECRET`
   - ⚠️ You can only see this once!

#### Step 4: Configure API Permissions

1. Go to "API permissions"
2. Click "Add a permission"
3. Choose "Microsoft Graph"
4. Choose "Delegated permissions"
5. Select:
   - `User.Read`
   - `email`
   - `profile`
6. Click "Add permissions"

#### Step 5: Update .env File

```env
MICROSOFT_CLIENT_ID=your-application-client-id-here
MICROSOFT_CLIENT_SECRET=your-client-secret-value-here
```

---

### 🌈 Instagram OAuth Setup (20 minutes)

#### Step 1: Create Facebook App

Instagram OAuth requires a Facebook App:

1. Go to: https://developers.facebook.com/
2. Click "My Apps" → "Create App"
3. Choose "Consumer" → Click "Next"
4. App name: `Flight Booking System`
5. App contact email: `your-email@example.com`
6. Click "Create App"

#### Step 2: Add Instagram Basic Display

1. In your app dashboard, click "Add Product"
2. Find "Instagram Basic Display" → Click "Set Up"
3. Click "Create New App"
4. Display name: `Flight Booking System`
5. Click "Create App"

#### Step 3: Configure OAuth Settings

1. Go to "Instagram Basic Display" → "Basic Display"
2. In "User Token Generator" section:
   - Valid OAuth Redirect URIs:
     ```
     http://localhost:5000/api/auth/instagram/callback
     ```
   - Deauthorize Callback URL:
     ```
     http://localhost:5000/api/auth/instagram/deauthorize
     ```
   - Data Deletion Request URL:
     ```
     http://localhost:5000/api/auth/instagram/delete
     ```
3. Click "Save Changes"

#### Step 4: Get Credentials

1. You'll see:
   - **Instagram App ID** - this is your `INSTAGRAM_CLIENT_ID`
   - **Instagram App Secret** - this is your `INSTAGRAM_CLIENT_SECRET`
2. **Copy both values**

#### Step 5: Add Test Users

1. Go to "Roles" → "Instagram Testers"
2. Click "Add Instagram Testers"
3. Enter Instagram username
4. The user must accept the invite on Instagram

#### Step 6: Update .env File

```env
INSTAGRAM_CLIENT_ID=your-instagram-app-id-here
INSTAGRAM_CLIENT_SECRET=your-instagram-app-secret-here
```

---

## 🔄 After Getting Credentials

### Step 1: Update backend/.env

Replace placeholder values with real credentials:

```env
# Google OAuth
GOOGLE_CLIENT_ID=1234567890-abc123xyz.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123xyz789def

# Microsoft OAuth
MICROSOFT_CLIENT_ID=abcd1234-5678-90ef-ghij-klmnopqrstuv
MICROSOFT_CLIENT_SECRET=abc~123.xyz_789-def

# Instagram OAuth
INSTAGRAM_CLIENT_ID=1234567890123456
INSTAGRAM_CLIENT_SECRET=abc123def456ghi789jkl012mno345pq
```

### Step 2: Disable Dev Mode

In `backend/.env`, change:
```env
OAUTH_DEV_MODE=false
```

### Step 3: Update Login.jsx

In `src/Components/Login.jsx`, change the `checkOAuthConfigured` function:

```javascript
const checkOAuthConfigured = (provider) => {
  // Change to true for providers you've configured
  if (provider === 'google') return true;
  if (provider === 'microsoft') return true;
  if (provider === 'instagram') return true;
  return false;
};
```

### Step 4: Restart Backend

```bash
# Stop backend (Ctrl+C in backend terminal)
# Start again:
npm start
```

### Step 5: Test OAuth

1. Go to: http://localhost:5174/login
2. Click "Continue with Google"
3. Should redirect to Google login
4. After login, redirects back to your app
5. User is logged in! ✅

---

## 🧪 Testing OAuth

### Test Google Login:
1. Click "Continue with Google"
2. Login with your Google account
3. Grant permissions
4. Redirected back to app
5. Check: User created in MongoDB with `googleId`

### Test Microsoft Login:
1. Click "Continue with Microsoft"
2. Login with Microsoft account
3. Grant permissions
4. Redirected back to app
5. Check: User created with `microsoftId`

### Test Instagram Login:
1. Click "Continue with Instagram"
2. Login with Instagram account
3. Grant permissions
4. Redirected back to app
5. Check: User created with `instagramId`

---

## 🔍 Troubleshooting

### Issue: "Redirect URI mismatch"

**Solution:**
- Check that redirect URI in OAuth console matches exactly:
  - Google: `http://localhost:5000/api/auth/google/callback`
  - Microsoft: `http://localhost:5000/api/auth/microsoft/callback`
  - Instagram: `http://localhost:5000/api/auth/instagram/callback`
- No trailing slashes!
- Must be exact match

### Issue: "App not verified"

**Solution:**
- For development, click "Advanced" → "Go to app (unsafe)"
- For production, submit app for verification

### Issue: "Invalid client"

**Solution:**
- Check Client ID and Secret are correct in `.env`
- No extra spaces or quotes
- Restart backend after changing `.env`

### Issue: "Access denied"

**Solution:**
- Check API permissions are granted
- For Instagram, make sure user is added as tester
- For Google, add user to test users list

---

## 📊 OAuth Flow Diagram

```
User clicks "Continue with Google"
         ↓
Frontend redirects to: http://localhost:5000/api/auth/google
         ↓
Backend redirects to: Google OAuth page
         ↓
User logs in with Google
         ↓
Google redirects to: http://localhost:5000/api/auth/google/callback
         ↓
Backend receives user profile from Google
         ↓
Backend creates/updates user in MongoDB
         ↓
Backend generates JWT token
         ↓
Backend redirects to: http://localhost:5174/oauth-callback?token=xxx
         ↓
Frontend stores token and user data
         ↓
User is logged in! ✅
```

---

## 💡 Development vs Production

### Development Mode (Current):
- ✅ Works immediately
- ✅ No OAuth credentials needed
- ✅ Perfect for testing
- ✅ Simulates OAuth flow
- ⚠️ Not for production use

### Production Mode (After setup):
- ✅ Real OAuth providers
- ✅ Secure authentication
- ✅ Production-ready
- ⚠️ Requires OAuth credentials
- ⚠️ Takes time to set up

---

## 🎯 Recommendation

**For Now:** Use Development Mode (I'm setting this up)
- Test OAuth functionality immediately
- No need to create OAuth apps
- Perfect for development

**Later:** Switch to Production Mode
- When you're ready to deploy
- Follow the detailed steps above
- Get real OAuth credentials

---

## ✅ Summary

**Development Mode:**
- Quick setup (2 minutes)
- Works without credentials
- Perfect for testing
- I'm implementing this now!

**Production Mode:**
- Takes 30-60 minutes
- Requires OAuth credentials
- Follow step-by-step guide above
- Switch when ready for production

**You can start with dev mode and switch to production later!** 🚀
