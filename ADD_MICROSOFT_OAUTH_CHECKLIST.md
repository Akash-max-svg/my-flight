# ✅ Add Microsoft OAuth - Simple Checklist

## 🎯 What You Need to Do

Microsoft OAuth is **already coded** in your project! You just need to get credentials from Microsoft Azure.

---

## 📋 Step-by-Step Checklist

### ☐ Step 1: Go to Azure Portal (2 min)
```
https://portal.azure.com/
```
- Sign in with Microsoft account
- If you don't have one, create it (free)

### ☐ Step 2: Register App (3 min)
1. Search "Azure Active Directory"
2. Click "App registrations"
3. Click "+ New registration"
4. Fill form:
   - **Name:** Flight Booking App
   - **Account types:** Select "Multitenant and personal Microsoft accounts"
   - **Redirect URI:** Web → `http://localhost:5000/api/auth/microsoft/callback`
5. Click "Register"

### ☐ Step 3: Copy Client ID (30 sec)
On the Overview page, copy:
```
Application (client) ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```
Save this somewhere!

### ☐ Step 4: Create Client Secret (1 min)
1. Click "Certificates & secrets" (left menu)
2. Click "+ New client secret"
3. Description: `Flight Booking Secret`
4. Expires: 24 months
5. Click "Add"
6. **IMMEDIATELY COPY THE VALUE!** (You can't see it again)
```
Value: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
Save this somewhere!

### ☐ Step 5: Update backend/.env (1 min)
Open `backend/.env` and replace these lines:
```env
MICROSOFT_CLIENT_ID=your_microsoft_client_id_here
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret_here
```

With your actual values:
```env
MICROSOFT_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MICROSOFT_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Save the file!

### ☐ Step 6: Restart Backend (30 sec)
```bash
# In backend terminal, press Ctrl+C to stop
# Then start again:
npm start
```

You should see:
```
✅ Microsoft OAuth strategy configured
```

### ☐ Step 7: Test It! (1 min)
1. Open http://localhost:5174/login
2. Click "Continue with Microsoft" button
3. Login with your Microsoft account
4. Grant permissions
5. You should be logged in!

---

## ✅ Success Indicators

### Backend Console:
```
✅ Microsoft OAuth strategy configured
🚀 Server running on port 5000
```

### After Login:
- ✅ Username appears in top-right corner
- ✅ User dropdown shows your email
- ✅ Success toast: "Logged in with Microsoft as [Your Name]"
- ✅ Browser console shows OAuth logs

---

## 🚨 Troubleshooting

### Problem: "Microsoft OAuth not configured"
**Solution:**
- Check `backend/.env` has the credentials
- Make sure no extra spaces
- Restart backend server

### Problem: "Reply URL does not match"
**Solution:**
- Go to Azure Portal → Your App → Authentication
- Add redirect URI: `http://localhost:5000/api/auth/microsoft/callback`
- Click Save

### Problem: "Invalid client secret"
**Solution:**
- Go to Azure Portal → Certificates & secrets
- Create a new secret
- Update `backend/.env` with new secret
- Restart backend

---

## 📊 What's Already Done

Your project already has:
- ✅ Microsoft OAuth strategy in `backend/config/passport.config.js`
- ✅ Microsoft routes in `backend/routes/oauth.routes.js`
- ✅ Microsoft button in `src/Components/Login.jsx`
- ✅ User model with `microsoftId` field
- ✅ OAuth callback handler
- ✅ User details display (same as Google)

**You only need to add the credentials!**

---

## 🎉 That's All!

Total time: **~10 minutes**

Once you add the credentials and restart the backend, Microsoft OAuth will work exactly like Google OAuth!

---

## 📚 Detailed Guides

- **Full Guide:** `SETUP_MICROSOFT_OAUTH.md`
- **Quick Start:** `MICROSOFT_OAUTH_QUICK_START.md`

---

**Ready?** Start with Step 1: https://portal.azure.com/
