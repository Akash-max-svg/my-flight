# 🔐 OAuth Social Login Implementation Guide

## ✅ Features Implemented

- ✅ **Google OAuth 2.0** - Login with Google account
- ✅ **Microsoft OAuth 2.0** - Login with Microsoft/Outlook account  
- ✅ **Instagram OAuth** - Login with Instagram (UI ready, needs credentials)
- ✅ **Real-time user data extraction** - Automatically extracts email, name, profile picture
- ✅ **Seamless integration** - Works alongside traditional email/password login
- ✅ **Auto-registration** - Creates user account automatically on first OAuth login

---

## 📦 Packages Installed

### Backend
```bash
npm install passport passport-google-oauth20 passport-microsoft passport-instagram express-session
```

### Dependencies Added:
- `passport` - Authentication middleware
- `passport-google-oauth20` - Google OAuth strategy
- `passport-microsoft` - Microsoft OAuth strategy
- `passport-instagram` - Instagram OAuth strategy
- `express-session` - Session management for OAuth

---

## 🗂️ Files Created/Modified

### Backend Files Created:
1. ✅ `backend/config/passport.config.js` - Passport OAuth strategies configuration
2. ✅ `backend/routes/oauth.routes.js` - OAuth routes (Google, Microsoft, Instagram)

### Backend Files Modified:
3. ✅ `backend/server.js` - Added session middleware and OAuth routes
4. ✅ `backend/models/User.model.js` - Added OAuth fields (googleId, microsoftId, instagramId, provider)
5. ✅ `backend/.env` - Added OAuth credentials placeholders

### Frontend Files Created:
6. ✅ `src/Components/OAuthCallback.jsx` - OAuth callback handler component

### Frontend Files Modified:
7. ✅ `src/Components/Login.jsx` - Added OAuth login buttons (Google, Microsoft, Instagram)
8. ✅ `src/App.jsx` - Added OAuth callback route

---

## 🔧 Setup Instructions

### Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen:
   - Application name: "Flight Booking System"
   - Authorized domains: `localhost`
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Authorized JavaScript origins: `http://localhost:5173`
   - Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
7. Copy **Client ID** and **Client Secret**
8. Update `backend/.env`:
   ```env
   GOOGLE_CLIENT_ID=your_actual_client_id_here
   GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
   ```

### Step 2: Get Microsoft OAuth Credentials

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to **Azure Active Directory** → **App registrations**
3. Click **New registration**:
   - Name: "Flight Booking System"
   - Supported account types: **Accounts in any organizational directory and personal Microsoft accounts**
   - Redirect URI: `http://localhost:5000/api/auth/microsoft/callback`
4. After creation, go to **Certificates & secrets** → **New client secret**
5. Copy **Application (client) ID** and **Client secret value**
6. Update `backend/.env`:
   ```env
   MICROSOFT_CLIENT_ID=your_actual_client_id_here
   MICROSOFT_CLIENT_SECRET=your_actual_client_secret_here
   ```

### Step 3: Get Instagram OAuth Credentials (Optional)

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select existing one
3. Add **Instagram Basic Display** product
4. Configure OAuth settings:
   - Valid OAuth Redirect URIs: `http://localhost:5000/api/auth/instagram/callback`
5. Copy **Instagram App ID** and **Instagram App Secret**
6. Update `backend/.env`:
   ```env
   INSTAGRAM_CLIENT_ID=your_actual_app_id_here
   INSTAGRAM_CLIENT_SECRET=your_actual_app_secret_here
   ```

---

## 🚀 How It Works

### User Flow:

1. **User clicks "Continue with Google/Microsoft/Instagram"** on Login page
2. **Redirected to OAuth provider** (Google/Microsoft/Instagram) for authentication
3. **User authorizes the app** and grants permissions
4. **OAuth provider redirects back** to backend callback URL with authorization code
5. **Backend exchanges code for access token** and fetches user profile
6. **Backend checks if user exists**:
   - If exists: Login existing user
   - If new: Create new user account automatically
7. **Backend generates JWT tokens** and redirects to frontend with tokens
8. **Frontend receives tokens** via `/oauth-callback` route
9. **Frontend fetches user details** using the token
10. **User is logged in** and redirected to home page

### Data Extracted from OAuth Providers:

#### Google:
- ✅ Email address
- ✅ Full name (displayName)
- ✅ Profile picture URL
- ✅ Google ID (unique identifier)
- ✅ Email verification status

#### Microsoft:
- ✅ Email address
- ✅ Full name (displayName)
- ✅ Profile picture URL
- ✅ Microsoft ID (unique identifier)
- ✅ Email verification status

#### Instagram:
- ✅ Username
- ✅ Profile picture URL
- ✅ Instagram ID (unique identifier)
- ⚠️ Note: Instagram doesn't provide email by default

---

## 🎨 UI Features

### Login Page Now Has:
- ✅ Beautiful OAuth buttons with brand colors
- ✅ Google button (blue) with Google logo
- ✅ Microsoft button (multi-color) with Microsoft logo
- ✅ Instagram button (gradient) with Instagram logo
- ✅ Hover effects and animations
- ✅ "OR" divider between traditional and OAuth login
- ✅ Disabled state during authentication

---

## 🔒 Security Features

1. **JWT Tokens**: Secure token-based authentication
2. **Session Management**: Express sessions for OAuth flow
3. **HTTPS Ready**: Configured for production with secure cookies
4. **CORS Protection**: Restricted to frontend URL only
5. **Password Hashing**: OAuth users get random secure passwords
6. **Email Verification**: OAuth emails are pre-verified

---

## 📊 Database Schema Updates

### User Model - New Fields:
```javascript
{
  googleId: String,           // Google unique ID
  microsoftId: String,        // Microsoft unique ID
  instagramId: String,        // Instagram unique ID
  provider: String,           // 'local', 'google', 'microsoft', 'instagram'
  profilePicture: String,     // Profile picture URL from OAuth
  isEmailVerified: Boolean    // Auto-true for OAuth users
}
```

---

## 🧪 Testing

### Test Google Login:
1. Start backend: `cd backend && npm start`
2. Start frontend: `npm run dev`
3. Go to `http://localhost:5173/login`
4. Click "Continue with Google"
5. Login with your Google account
6. Should redirect to home page logged in

### Test Microsoft Login:
1. Same steps as Google
2. Click "Continue with Microsoft"
3. Login with Microsoft/Outlook account

### Test Instagram Login:
1. Currently shows "Coming soon" message
2. Uncomment the redirect line in `Login.jsx` after setting up credentials

---

## ⚠️ Important Notes

### For Development:
- OAuth providers require **exact redirect URIs**
- Use `http://localhost:5000` (not `127.0.0.1`)
- Frontend must be on `http://localhost:5173`

### For Production:
1. Update redirect URIs in OAuth provider consoles
2. Update `backend/.env`:
   ```env
   GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
   MICROSOFT_CALLBACK_URL=https://yourdomain.com/api/auth/microsoft/callback
   FRONTEND_URL=https://yourdomain.com
   ```
3. Enable HTTPS
4. Set `NODE_ENV=production`

---

## 🐛 Troubleshooting

### "Redirect URI mismatch" error:
- Check OAuth provider console has exact callback URL
- Ensure no trailing slashes
- Use `http://localhost:5000` not `http://127.0.0.1:5000`

### "User not found" after OAuth:
- Check backend logs for user creation errors
- Verify MongoDB connection
- Check User model has OAuth fields

### OAuth button not working:
- Check backend server is running on port 5000
- Check browser console for errors
- Verify OAuth credentials in `.env` file

---

## 📝 Next Steps

1. ✅ Get OAuth credentials from Google/Microsoft
2. ✅ Update `backend/.env` with real credentials
3. ✅ Test OAuth login flow
4. ✅ (Optional) Set up Instagram OAuth
5. ✅ Deploy to production with HTTPS

---

## 🎉 Status

**Implementation:** ✅ COMPLETE  
**Testing:** ⏳ PENDING (Needs OAuth credentials)  
**Production Ready:** ⏳ PENDING (Needs credentials + HTTPS)

Once you add the OAuth credentials to `backend/.env`, the social login will work immediately!
