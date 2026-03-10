# 🎨 OAuth Social Login - Visual Guide

## 📱 Login Page - New Look

### Before (Traditional Login Only):
```
┌─────────────────────────────────┐
│   Login to FlightBook           │
│                                  │
│   [Email Input]                  │
│   [Password Input]               │
│   [Login Button]                 │
│                                  │
│   Don't have account? Sign Up    │
└─────────────────────────────────┘
```

### After (With OAuth Social Login):
```
┌─────────────────────────────────────────┐
│   Login to FlightBook                   │
│                                          │
│   [Email Input]                          │
│   [Password Input]                       │
│   [Login Button]                         │
│                                          │
│   ────────────── OR ──────────────      │
│                                          │
│   ┌───────────────────────────────┐    │
│   │ 🔵 Continue with Google       │    │
│   └───────────────────────────────┘    │
│                                          │
│   ┌───────────────────────────────┐    │
│   │ 🔷 Continue with Microsoft    │    │
│   └───────────────────────────────┘    │
│                                          │
│   ┌───────────────────────────────┐    │
│   │ 🌈 Continue with Instagram    │    │
│   └───────────────────────────────┘    │
│                                          │
│   Don't have account? Sign Up           │
└─────────────────────────────────────────┘
```

---

## 🎨 Button Designs

### Google Button
```
┌─────────────────────────────────────┐
│  [G]  Continue with Google          │  ← Blue hover effect
└─────────────────────────────────────┘
   ↑
   Google logo (4 colors)
```
- **Colors**: Google's official colors (Blue, Red, Yellow, Green)
- **Hover**: Light blue background (#f8f9ff)
- **Border**: Blue (#4285f4) on hover

### Microsoft Button
```
┌─────────────────────────────────────┐
│  [⊞]  Continue with Microsoft       │  ← Light blue hover
└─────────────────────────────────────┘
   ↑
   Microsoft logo (4 squares)
```
- **Colors**: Microsoft's official colors (Red, Green, Blue, Yellow squares)
- **Hover**: Light blue background (#f0f9ff)
- **Border**: Microsoft blue (#00a4ef) on hover

### Instagram Button
```
┌─────────────────────────────────────┐
│  [📷]  Continue with Instagram      │  ← Pink hover effect
└─────────────────────────────────────┘
   ↑
   Instagram logo (gradient camera)
```
- **Colors**: Instagram gradient (Purple to Pink to Orange)
- **Hover**: Light pink background (#fff5f7)
- **Border**: Instagram pink (#e4405f) on hover

---

## 🔄 User Flow Visualization

### Successful OAuth Login Flow:

```
User                Frontend              Backend              OAuth Provider
  │                    │                     │                      │
  │  Click "Google"    │                     │                      │
  ├───────────────────>│                     │                      │
  │                    │  Redirect to        │                      │
  │                    │  /api/auth/google   │                      │
  │                    ├────────────────────>│                      │
  │                    │                     │  Redirect to Google  │
  │                    │                     ├─────────────────────>│
  │                    │                     │                      │
  │                    │                     │  ← User authorizes   │
  │                    │                     │<─────────────────────┤
  │                    │                     │                      │
  │                    │  ← Callback with    │                      │
  │                    │    auth code        │                      │
  │                    │<────────────────────┤                      │
  │                    │                     │                      │
  │                    │                     │  Exchange code       │
  │                    │                     │  for access token    │
  │                    │                     ├─────────────────────>│
  │                    │                     │                      │
  │                    │                     │  ← User profile data │
  │                    │                     │<─────────────────────┤
  │                    │                     │                      │
  │                    │                     │  Create/Update user  │
  │                    │                     │  in MongoDB          │
  │                    │                     │                      │
  │                    │  Redirect with JWT  │                      │
  │                    │  tokens             │                      │
  │  ← Redirect to     │<────────────────────┤                      │
  │    /oauth-callback │                     │                      │
  │<───────────────────┤                     │                      │
  │                    │                     │                      │
  │                    │  Fetch user details │                      │
  │                    │  with token         │                      │
  │                    ├────────────────────>│                      │
  │                    │                     │                      │
  │                    │  ← User data        │                      │
  │                    │<────────────────────┤                      │
  │                    │                     │                      │
  │  ← Redirect to     │                     │                      │
  │    /home (logged)  │                     │                      │
  │<───────────────────┤                     │                      │
  │                    │                     │                      │
  ✓ Logged in!         ✓                     ✓                      ✓
```

---

## 💾 Data Extraction Example

### What Gets Extracted from Google:

```javascript
{
  // From Google Profile
  googleId: "1234567890",
  email: "user@gmail.com",
  username: "John Doe",
  profilePicture: "https://lh3.googleusercontent.com/...",
  isEmailVerified: true,
  provider: "google",
  
  // Auto-generated defaults
  age: 25,
  gender: "prefer-not-to-say",
  mobile: "0000000000",
  country: "Not specified",
  dob: "2000-01-01",
  
  // Generated by backend
  _id: "507f1f77bcf86cd799439011",
  createdAt: "2026-03-02T10:30:00.000Z",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### What Gets Extracted from Microsoft:

```javascript
{
  // From Microsoft Profile
  microsoftId: "abcd-1234-efgh-5678",
  email: "user@outlook.com",
  username: "Jane Smith",
  profilePicture: "https://graph.microsoft.com/...",
  isEmailVerified: true,
  provider: "microsoft",
  
  // Auto-generated defaults (same as Google)
  age: 25,
  gender: "prefer-not-to-say",
  mobile: "0000000000",
  country: "Not specified",
  dob: "2000-01-01"
}
```

---

## 🎯 Button States

### Normal State:
```css
background: white
border: 2px solid #e5e7eb (light gray)
color: #333 (dark gray)
```

### Hover State:
```css
transform: translateY(-2px)  /* Lifts up */
box-shadow: 0 4px 12px rgba(0,0,0,0.15)  /* Shadow */
border-color: [brand color]  /* Google blue, Microsoft blue, Instagram pink */
background: [light brand color]  /* Subtle brand tint */
```

### Disabled State (during login):
```css
opacity: 0.6
cursor: not-allowed
pointer-events: none
```

---

## 📱 Responsive Design

### Desktop (> 768px):
- Buttons: Full width (100%)
- Spacing: 12px between buttons
- Font size: 16px

### Mobile (< 768px):
- Buttons: Full width (100%)
- Spacing: 10px between buttons
- Font size: 14px
- Icons: Slightly smaller (20px)

---

## 🎨 Color Palette

### Google:
- Primary: `#4285F4` (Blue)
- Hover BG: `#f8f9ff` (Light blue)
- Logo: 4-color (Blue, Red, Yellow, Green)

### Microsoft:
- Primary: `#00a4ef` (Blue)
- Hover BG: `#f0f9ff` (Light blue)
- Logo: 4-square (Red, Green, Blue, Yellow)

### Instagram:
- Primary: `#e4405f` (Pink)
- Hover BG: `#fff5f7` (Light pink)
- Logo: Gradient (Purple → Pink → Orange)

---

## ✨ Animation Effects

### Button Hover:
```css
transition: all 0.3s ease
transform: translateY(-2px)  /* Smooth lift */
box-shadow: 0 4px 12px rgba(0,0,0,0.15)  /* Shadow appears */
```

### Loading State:
```css
/* Spinner appears in OAuth callback page */
.spinner-border {
  width: 3rem;
  height: 3rem;
  animation: spin 1s linear infinite;
}
```

---

## 🔐 Security Indicators

### OAuth Callback Page Shows:
```
┌─────────────────────────────────┐
│   [Spinner Animation]            │
│                                  │
│   Completing authentication...   │
│   Please wait while we log you in│
└─────────────────────────────────┘
```

### Success Toast:
```
✅ Logged in successfully with Google!
```

### Error Toast:
```
❌ Authentication failed: [error message]
```

---

## 🎉 Final Result

Users can now login using:
1. ✅ Traditional email/password
2. ✅ Google account (one click)
3. ✅ Microsoft account (one click)
4. ✅ Instagram account (one click, when configured)

All user data is automatically extracted and stored in MongoDB!
