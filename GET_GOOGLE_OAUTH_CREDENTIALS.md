# 🔐 Get Real Google OAuth Credentials - Step by Step

## 🎯 Goal: Real Google Login

Make "Continue with Google" open actual Google login page and get user's real Google account details.

---

## ⚡ Quick Setup (10 Minutes)

### Step 1: Go to Google Cloud Console

**Open this link:** https://console.cloud.google.com/

**Login** with your Google account (any Gmail account)

---

### Step 2: Create New Project

1. Click **"Select a project"** at the top
2. Click **"NEW PROJECT"**
3. Project name: `Flight Booking`
4. Click **"CREATE"**
5. Wait 10 seconds for project to be created
6. Click **"SELECT PROJECT"** to use it

---

### Step 3: Enable Google+ API

1. In the left menu, click **"APIs & Services"** → **"Library"**
2. In the search box, type: `Google+ API`
3. Click on **"Google+ API"**
4. Click **"ENABLE"** button
5. Wait for it to enable (5 seconds)

---

### Step 4: Configure OAuth Consent Screen

1. In the left menu, click **"OAuth consent screen"**
2. Choose **"External"** (for testing with any Google account)
3. Click **"CREATE"**

4. **Fill in the form:**
   - App name: `Flight Booking System`
   - User support email: Select your email from dropdown
   - App logo: (skip for now)
   - App domain: (skip for now)
   - Developer contact: Type your email

5. Click **"SAVE AND CONTINUE"**

6. **Scopes page:**
   - Click **"ADD OR REMOVE SCOPES"**
   - Find and check these two:
     - ✅ `.../auth/userinfo.email`
     - ✅ `.../auth/userinfo.profile`
   - Click **"UPDATE"**
   - Click **"SAVE AND CONTINUE"**

7. **Test users page:**
   - Click **"+ ADD USERS"**
   - Enter your Gmail address
   - Click **"ADD"**
   - Click **"SAVE AND CONTINUE"**

8. Click **"BACK TO DASHBOARD"**

---

### Step 5: Create OAuth Credentials

1. In the left menu, click **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"OAuth 2.0 Client ID"**

4. **Fill in the form:**
   - Application type: **Web application**
   - Name: `Flight Booking Web Client`
   
   - **Authorized JavaScript origins:**
     - Click **"+ ADD URI"**
     - Enter: `http://localhost:5174`
     - Click **"+ ADD URI"** again
     - Enter: `http://localhost:5173`
   
   - **Authorized redirect URIs:**
     - Click **"+ ADD URI"**
     - Enter: `http://localhost:5000/api/auth/google/callback`

5. Click **"CREATE"**

6. **IMPORTANT:** A popup appears with your credentials!
   - **Copy the Client ID** (looks like: `123456789-abc123.apps.googleusercontent.com`)
   - **Copy the Client Secret** (looks like: `GOCSPX-abc123xyz`)
   - Click **"OK"**

---

### Step 6: Update Your .env File

1. Open `backend/.env` file
2. Find these lines:
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   ```

3. Replace with your actual credentials:
   ```env
   GOOGLE_CLIENT_ID=123456789-abc123.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-abc123xyz
   ```

4. **Save the file**

---

### Step 7: Restart Backend

```bash
# Stop backend (Ctrl+C in backend terminal)
# Start again:
npm start
```

---

### Step 8: Test Real Google Login!

1. **Open:** http://localhost:5174/login
2. **Click:** "Continue with Google"
3. **You'll see:** Real Google login page! 🎉
4. **Login** with your Google account
5. **Grant permissions** when asked
6. **Redirected back** to your app
7. **You're logged in** with your real Google account! ✅

---

## 🎉 What You'll Get

When user logs in with Google, you'll get their:
- ✅ Real name from Google account
- ✅ Real email address
- ✅ Profile picture from Google
- ✅ Google ID (unique identifier)
- ✅ Verified email status

All stored in your MongoDB database!

---

## 📋 Quick Checklist

- [ ] Go to https://console.cloud.google.com/
- [ ] Create project "Flight Booking"
- [ ] Enable Google+ API
- [ ] Configure OAuth consent screen
- [ ] Add test users (your Gmail)
- [ ] Create OAuth credentials
- [ ] Copy Client ID and Secret
- [ ] Update backend/.env file
- [ ] Restart backend
- [ ] Test login!

---

## 🔍 Troubleshooting

### Issue: "Redirect URI mismatch"
**Solution:** Make sure redirect URI is exactly:
```
http://localhost:5000/api/auth/google/callback
```
No trailing slash, no extra characters.

### Issue: "App not verified"
**Solution:** Click "Advanced" → "Go to Flight Booking System (unsafe)"
This is normal for testing. For production, submit app for verification.

### Issue: "Access blocked"
**Solution:** Make sure you added your Gmail as a test user in Step 4.

---

## 💡 After Setup

Once you have real Google OAuth working:
- Users can login with their real Google accounts
- Gets their actual name, email, and photo
- Secure and trusted authentication
- Professional user experience

---

## ⏱️ Time Required

- **First time:** 10-15 minutes
- **Already have project:** 5 minutes
- **Just updating credentials:** 2 minutes

---

## 🎯 Next Steps

After Google OAuth works, you can also set up:
- Microsoft OAuth (similar process, 10 minutes)
- Instagram OAuth (requires Facebook Developer account, 15 minutes)

But start with Google - it's the easiest and most popular!

---

## 📞 Need Help?

If you get stuck:
1. Check the troubleshooting section above
2. Make sure all URLs are exactly correct
3. Restart backend after changing .env
4. Clear browser cache and try again

---

## ✅ Summary

**What to do:**
1. Go to Google Cloud Console
2. Create project and enable API
3. Configure OAuth consent
4. Create credentials
5. Copy Client ID and Secret
6. Update backend/.env
7. Restart backend
8. Test!

**Time:** 10 minutes

**Result:** Real Google OAuth working! 🚀

**Start here:** https://console.cloud.google.com/
