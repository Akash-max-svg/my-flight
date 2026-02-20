# 📧 Email Notification Setup Guide

This guide will help you set up email notifications for your Flight Booking System.

---

## 🎯 Features

Once configured, users will receive emails for:

- ✅ **Welcome Email** - When they register
- ✅ **Booking Confirmation** - When they book a flight
- ✅ **Cancellation Confirmation** - When they cancel a booking
- ✅ **Flight Reminders** - 24 hours before departure
- ✅ **Booking Updates** - For any changes to their booking

---

## 📋 Prerequisites

- Gmail account (recommended)
- 2-Factor Authentication enabled on Gmail
- App Password generated from Google

---

## 🚀 Setup Instructions

### Step 1: Enable 2-Factor Authentication

1. Go to your Google Account: https://myaccount.google.com
2. Click on **Security** in the left sidebar
3. Under "Signing in to Google", click on **2-Step Verification**
4. Follow the prompts to enable 2FA

### Step 2: Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
2. You may need to sign in again
3. In the "Select app" dropdown, choose **Mail**
4. In the "Select device" dropdown, choose **Other (Custom name)**
5. Enter a name like "Flight Booking System"
6. Click **Generate**
7. Google will display a 16-character password
8. **Copy this password** (you won't be able to see it again)

### Step 3: Configure Backend Environment

1. Open `backend/.env` file
2. Update the email configuration:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

Replace:
- `your-email@gmail.com` with your actual Gmail address
- `abcd efgh ijkl mnop` with the 16-character App Password (spaces are optional)

### Step 4: Test Email Configuration

1. Start your backend server:
```bash
cd backend
npm run dev
```

2. The server will automatically test the email configuration on startup
3. Check the console for:
   - ✅ "Email configuration is valid" - Success!
   - ❌ "Email not configured" - Check your credentials

---

## 🧪 Testing Email Notifications

### Test 1: Welcome Email
1. Register a new user account
2. Check the email inbox for welcome email

### Test 2: Booking Confirmation
1. Login to your account
2. Search and book a flight
3. Check email for booking confirmation

### Test 3: Cancellation Email
1. Go to your bookings dashboard
2. Cancel a booking
3. Check email for cancellation confirmation

---

## 🔧 Troubleshooting

### Issue: "Invalid login credentials"

**Solution:**
- Verify 2FA is enabled on your Gmail account
- Regenerate the App Password
- Make sure you're using the App Password, not your regular Gmail password
- Remove any spaces from the App Password in .env file

### Issue: "Connection timeout"

**Solution:**
- Check your internet connection
- Verify EMAIL_HOST is `smtp.gmail.com`
- Verify EMAIL_PORT is `587`
- Check if your firewall is blocking port 587

### Issue: "Email not configured"

**Solution:**
- Make sure EMAIL_USER and EMAIL_PASSWORD are set in backend/.env
- Restart the backend server after updating .env
- Check for typos in the .env file

### Issue: Emails going to spam

**Solution:**
- Add the sender email to your contacts
- Mark the email as "Not Spam"
- For production, use a custom domain with proper SPF/DKIM records

---

## 📧 Email Templates

The system includes professionally designed email templates:

### 1. Welcome Email
- Sent when user registers
- Includes account details and features overview

### 2. Booking Confirmation
- Sent immediately after booking
- Includes:
  - Booking reference number
  - Flight details (airline, route, times)
  - Passenger information
  - Payment summary
  - Pre-flight checklist

### 3. Cancellation Email
- Sent when booking is cancelled
- Includes:
  - Cancellation details
  - Refund information
  - Refund timeline

### 4. Flight Reminder
- Can be sent 24 hours before departure
- Includes:
  - Flight details
  - Pre-flight checklist
  - Travel tips

### 5. Booking Update
- Sent for any booking changes
- Includes update details and current status

---

## 🎨 Email Template Features

All emails include:
- ✅ Professional gradient header
- ✅ Responsive design (mobile-friendly)
- ✅ Clear information hierarchy
- ✅ Brand colors and styling
- ✅ Important information highlighted
- ✅ Footer with disclaimer

---

## 🔒 Security Best Practices

1. **Never commit .env file** to version control
2. **Use App Passwords** instead of regular passwords
3. **Rotate App Passwords** periodically
4. **Monitor email logs** for suspicious activity
5. **Use environment variables** in production

---

## 🌐 Alternative Email Providers

While Gmail is recommended for development, you can use other providers:

### SendGrid
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

### Mailgun
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=your-mailgun-username
EMAIL_PASSWORD=your-mailgun-password
```

### AWS SES
```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USER=your-ses-smtp-username
EMAIL_PASSWORD=your-ses-smtp-password
```

---

## 📊 Email Service Status

The email service will:
- ✅ Work silently if configured correctly
- ⚠️ Log warnings if not configured (won't break the app)
- ❌ Log errors if configuration is invalid

**Note:** The application will continue to work even if email is not configured. Users just won't receive email notifications.

---

## 🚀 Production Deployment

For production, consider:

1. **Use a dedicated email service** (SendGrid, Mailgun, AWS SES)
2. **Set up custom domain** for professional emails
3. **Configure SPF and DKIM** records
4. **Monitor email delivery rates**
5. **Implement email queues** for high volume
6. **Add unsubscribe functionality**
7. **Track email opens and clicks**

---

## 📝 Environment Variables Reference

```env
# Required for email functionality
EMAIL_HOST=smtp.gmail.com          # SMTP server
EMAIL_PORT=587                     # SMTP port (587 for TLS)
EMAIL_USER=your-email@gmail.com    # Your Gmail address
EMAIL_PASSWORD=your-app-password   # 16-char App Password

# Optional (uses defaults if not set)
EMAIL_FROM=noreply@flightbooking.com  # Sender name/email
```

---

## ✅ Verification Checklist

- [ ] 2FA enabled on Gmail
- [ ] App Password generated
- [ ] EMAIL_USER configured in .env
- [ ] EMAIL_PASSWORD configured in .env
- [ ] Backend server restarted
- [ ] Email configuration test passed
- [ ] Welcome email received on registration
- [ ] Booking confirmation email received
- [ ] Cancellation email received

---

## 🆘 Support

If you encounter issues:

1. Check the backend console logs
2. Verify all steps in this guide
3. Test with a different Gmail account
4. Check Gmail's security settings
5. Review the troubleshooting section

---

## 📚 Additional Resources

- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [Nodemailer Documentation](https://nodemailer.com/)
- [Gmail SMTP Settings](https://support.google.com/mail/answer/7126229)

---

**Happy Emailing! 📧**
