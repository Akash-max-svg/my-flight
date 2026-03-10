# 🔵 Setup Microsoft OAuth - Complete Guide

## 📋 Overview

This guide will help you add Microsoft OAuth login to your flight booking application, just like Google OAuth.

---

## 🎯 Step 1: Create Microsoft Azure Account

### 1.1 Go to Azure Portal
```
https://portal.azure.com/
```

### 1.2 Sign In or Create Account
- Use your Microsoft account (Outlook, Hotmail, or create new)
- If you don't have one, click "Create one!"
- Follow the registration process

### 1.3 Access Azure Active Directory
1. Once logged in, search for "Azure Active Directory" in the search bar
2. Click on "Azure Active Directory"

---

## 🎯 Step 2: Register Your Application

### 2.1 Go to App Registrations
1. In Azure Active Directory, click "App registrations" in the left menu
2. Click "+ New registration" button

### 2.2 Fill Registration Form

**Name:**
```
Flight Booking App
```
(or any name you prefer)

**Supported account types:**
Select: "Accounts in any organizational directory (Any Azure AD directory - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)"

**Redirect URI:**
- Platform: Web
- URI: `http://localhost:5000/api/auth/microsoft/callback`

### 2.3 Click "Register"

---

## 🎯 Step 3: Get Your Credentials

### 3.1 Copy Application (client) ID
After registration, you'll see the Overview page.

**Copy this value:**
```
Application (client) ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

This is your `MICROSOFT_CLIENT_ID`

### 3.2 Create Client Secret
1. In the left menu, click "Certificates & secrets"
2. Click "+ New client secret"
3. Description: `Flight Booking Secret`
4. Expires: Choose "24 months" (or your preference)
5. Click "Add"

**IMPORTANT:** Copy the secret VALUE immediately! It won't be shown again.
```
Value: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

This is your `MICROSOFT_CLIENT_SECRET`

---

## 🎯 Step 4: Configure API Permissions

### 4.1 Add Permissions
1. In the left menu, click "API permissions"
2. Click "+ Add a permission"
3. Select "Microsoft Graph"
4. Select "Delegated permissions"
5. Search and add these permissions:
   - ✅ `User.Read` (should already be there)
   - ✅ `email`
   - ✅ `profile`
   - ✅ `openid`

### 4.2 Grant Admin Consent (Optional)
- Click "Grant admin consent for [Your Directory]"
- Click "Yes" to confirm

---

## 🎯 Step 5: Add Redirect URIs

### 5.1 Go to Authentication
1. In the left menu, click "Authentication"
2. Under "Platform configurations" → "Web"
3. Make sure these URIs are added:

**Redirect URIs:**
```
http://localhost:5000/api/auth/microsoft/callback
```

**For production (add later):**
```
https://yourdomain.com/api/auth/microsoft/callback
```

### 5.2 Configure Token Settings
Scroll down to "Implicit grant and hybrid flows":
- ✅ Check "ID tokens"
- ✅ Check "Access tokens"

Click "Save"

---

## 🎯 Step 6: Update Backend Configuration

### 6.1 Open `backend/.env`

### 6.2 Update Microsoft OAuth Credentials
Replace these lines:
```env
# Microsoft OAuth
MICROSOFT_CLIENT_ID=your_microsoft_client_id_here
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret_here
MICROSOFT_CALLBACK_URL=http://localhost:5000/api/auth/microsoft/callback
```

With your actual credentials:
```env
# Microsoft OAuth
MICROSOFT_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MICROSOFT_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MICROSOFT_CALLBACK_URL=http://localhost:5000/api/auth/microsoft/callback
```

### 6.3 Save the file

---

## 🎯 Step 7: Verify Backend Code

The backend code is already set up! Let me verify it's correct:

### 7.1 Check `backend/config/passport.config.js`
The Microsoft strategy should already be there:
```javascript
passport.use(
  new MicrosoftStrategy(
    {
      clientID: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      callbackURL: process.env.MICROSOFT_CALLBACK_URL,
      scope: ['user.read']
    },
    async (accessToken, refreshToken, profile, done) => {
      // User creation/login logic
    }
  )
);
```

### 7.2 Check `backend/routes/oauth.routes.js`
Microsoft routes should already be there:
```javascript
// Initiate Microsoft OAuth
router.get('/microsoft', passport.authenticate('microsoft', {...}));

// Microsoft OAuth callback
router.get('/microsoft/callback', passport.authenticate('microsoft', {...}));
```

---

## 🎯 Step 8: Test Microsoft OAuth

### 8.1 Restart Backend Server
```bash
# Stop the server (Ctrl+C)
# Start again
cd backend
npm start
```

You should see:
```
✅ Microsoft OAuth strategy configured
```

### 8.2 Test Login Flow
1. Open http://localhost:5174/login
2. Click "Continue with Microsoft" button
3. You'll be redirected to Microsoft login page
4. Login with your Microsoft account
5. Grant permissions
6. You should be redirected back and logged in!

### 8.3 Verify User Details
After login, check:
- ✅ Username appears in top-right corner
- ✅ User dropdown shows email
- ✅ All features work

---

## 🎯 Step 9: Troubleshooting

### Issue 1: "AADSTS50011: The reply URL specified in the request does not match"
**Solution:** 
- Go to Azure Portal → App registrations → Your app → Authentication
- Make sure `http://localhost:5000/api/auth/microsoft/callback` is in Redirect URIs
- Click Save

### Issue 2: "Microsoft OAuth not configured"
**Solution:**
- Check `backend/.env` has correct credentials
- Make sure no spaces in the values
- Restart backend server

### Issue 3: "Invalid client secret"
**Solution:**
- The secret might have expired
- Go to Azure Portal → Certificates & secrets
- Create a new secret
- Update `backend/.env` with new secret

### Issue 4: User details not showing
**Solution:**
- Same as Google OAuth - already fixed!
- Check browser console for logs
- Run `window.checkAuthStatus()` in console

---

## 🎯 Step 10: Production Setup (Later)

When deploying to production:

### 10.1 Add Production Redirect URI
In Azure Portal → Authentication → Redirect URIs:
```
https://yourdomain.com/api/auth/microsoft/callback
```

### 10.2 Update Environment Variables
In production `.env`:
```env
MICROSOFT_CALLBACK_URL=https://yourdomain.com/api/auth/microsoft/callback
FRONTEND_URL=https://yourdomain.com
```

### 10.3 Update CORS
In `backend/server.js`, update CORS origin to your production domain.

---

## 📊 Quick Reference

### Azure Portal URLs
- **Main Portal:** https://portal.azure.com/
- **App Registrations:** Azure Active Directory → App registrations
- **Your App:** Find your app in the list

### Required Permissions
- `User.Read` - Read user profile
- `email` - Read user email
- `profile` - Read user profile info
- `openid` - OpenID Connect

### Redirect URIs
- **Development:** `http://localhost:5000/api/auth/microsoft/callback`
- **Production:** `https://yourdomain.com/api/auth/microsoft/callback`

### Environment Variables
```env
MICROSOFT_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MICROSOFT_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MICROSOFT_CALLBACK_URL=http://localhost:5000/api/auth/microsoft/callback
```

---

## ✅ Verification Checklist

Before testing, make sure:
- [ ] Azure app registered
- [ ] Client ID copied
- [ ] Client secret copied (and saved!)
- [ ] Redirect URI configured in Azure
- [ ] Permissions added (User.Read, email, profile, openid)
- [ ] `backend/.env` updated with credentials
- [ ] Backend server restarted
- [ ] No errors in backend console

---

## 🎉 Success Criteria

Microsoft OAuth is working when:
1. ✅ Backend shows "✅ Microsoft OAuth strategy configured"
2. ✅ Click "Continue with Microsoft" opens Microsoft login
3. ✅ After login, redirected back to app
4. ✅ Username displays in UI
5. ✅ User dropdown shows email
6. ✅ Console shows OAuth logs
7. ✅ All features work

---

## 📝 Notes

### About Microsoft Accounts
Microsoft OAuth works with:
- ✅ Personal Microsoft accounts (Outlook, Hotmail, Live)
- ✅ Work/School accounts (Office 365, Azure AD)
- ✅ Xbox accounts
- ✅ Skype accounts

### About Permissions
- `User.Read` is the minimum required permission
- Additional permissions can be added later if needed
- Users will see permission consent screen on first login

### About Security
- Client secret should be kept secure
- Never commit secrets to Git
- Rotate secrets periodically
- Use different credentials for dev/prod

---

## 🆘 Need Help?

### Check Backend Logs
```bash
# Backend terminal should show:
✅ Microsoft OAuth strategy configured
```

### Check Browser Console
```javascript
// After Microsoft login, you should see:
🔓 Decoded JWT token: { id: "...", email: "...", provider: "microsoft" }
📡 Fetching user details from backend...
📡 Response status: 200
✅ OAuth user data stored
```

### Test Backend Module
```bash
node backend/test-all-features.js
```

Should show:
```
✅ Microsoft OAuth strategy configured
```

---

## 🔗 Useful Links

- **Azure Portal:** https://portal.azure.com/
- **Microsoft Identity Platform Docs:** https://docs.microsoft.com/en-us/azure/active-directory/develop/
- **Passport Microsoft Strategy:** https://www.passportjs.org/packages/passport-microsoft/

---

**Ready to set up Microsoft OAuth?** Follow the steps above! 🚀

**Estimated Time:** 10-15 minutes
