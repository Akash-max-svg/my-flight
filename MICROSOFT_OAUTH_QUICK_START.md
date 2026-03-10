# 🚀 Microsoft OAuth - Quick Start (5 Minutes)

## 🎯 Super Quick Setup

### Step 1: Get Credentials (5 min)
1. Go to https://portal.azure.com/
2. Search "Azure Active Directory"
3. Click "App registrations" → "+ New registration"
4. Name: `Flight Booking App`
5. Account types: Select "Multitenant and personal accounts"
6. Redirect URI: `http://localhost:5000/api/auth/microsoft/callback`
7. Click "Register"

### Step 2: Copy Credentials
**Application (client) ID:**
```
Copy this: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**Client Secret:**
1. Click "Certificates & secrets"
2. "+ New client secret"
3. Add → Copy the VALUE immediately!
```
Copy this: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 3: Update backend/.env
```env
MICROSOFT_CLIENT_ID=paste_your_client_id_here
MICROSOFT_CLIENT_SECRET=paste_your_secret_here
MICROSOFT_CALLBACK_URL=http://localhost:5000/api/auth/microsoft/callback
```

### Step 4: Restart Backend
```bash
# Stop server (Ctrl+C)
# Start again
cd backend
npm start
```

### Step 5: Test!
1. Open http://localhost:5174/login
2. Click "Continue with Microsoft"
3. Login with Microsoft account
4. ✅ Done!

---

## 📸 Visual Guide

### What You'll See in Azure Portal

**1. App Registrations Page:**
```
┌─────────────────────────────────────────┐
│ App registrations                       │
│                                         │
│ [+ New registration]                    │
│                                         │
│ Display name: Flight Booking App        │
│ Supported account types:                │
│ ○ Single tenant                         │
│ ● Multitenant and personal accounts ✓  │
│ ○ Personal accounts only                │
│                                         │
│ Redirect URI (optional):                │
│ Web ▼ http://localhost:5000/api/...    │
│                                         │
│ [Register]                              │
└─────────────────────────────────────────┘
```

**2. Overview Page (After Registration):**
```
┌─────────────────────────────────────────┐
│ Flight Booking App                      │
│                                         │
│ Application (client) ID:                │
│ xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx   │
│ [Copy] ← COPY THIS!                     │
│                                         │
│ Directory (tenant) ID:                  │
│ xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx   │
│                                         │
└─────────────────────────────────────────┘
```

**3. Certificates & Secrets Page:**
```
┌─────────────────────────────────────────┐
│ Certificates & secrets                  │
│                                         │
│ Client secrets                          │
│ [+ New client secret]                   │
│                                         │
│ Description: Flight Booking Secret      │
│ Expires: 24 months                      │
│ [Add]                                   │
│                                         │
│ After adding:                           │
│ Value: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx │
│ [Copy] ← COPY THIS IMMEDIATELY!         │
│                                         │
└─────────────────────────────────────────┘
```

---

## ✅ Verification

### Backend Console Should Show:
```
✅ Microsoft OAuth strategy configured
🚀 Server running on port 5000
```

### Browser Console Should Show (After Login):
```
🔓 Decoded JWT token: { provider: "microsoft", ... }
📡 Fetching user details from backend...
✅ OAuth user data stored
```

### UI Should Show:
- ✅ Your username in top-right corner
- ✅ User dropdown with email
- ✅ Success toast: "Logged in with Microsoft as [Your Name]"

---

## 🚨 Common Issues

### "Microsoft OAuth not configured"
**Fix:** Check backend/.env has credentials, restart server

### "Reply URL does not match"
**Fix:** In Azure Portal → Authentication → Add redirect URI:
`http://localhost:5000/api/auth/microsoft/callback`

### "Invalid client secret"
**Fix:** Create new secret in Azure Portal, update .env

---

## 🎉 That's It!

Microsoft OAuth should now work just like Google OAuth!

**Test it:** http://localhost:5174/login → Click "Continue with Microsoft"

---

**Need detailed guide?** See `SETUP_MICROSOFT_OAUTH.md`
