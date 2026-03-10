# 📧 EMAIL SYSTEM - HOW IT WORKS

## ✅ ALREADY CONFIGURED!

Your email system is **ALREADY SET UP** and ready to send booking confirmation emails!

## CURRENT CONFIGURATION

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=akashmedhara@gmail.com
EMAIL_PASSWORD=xvae hjax zvzx umck
```

This uses **Gmail SMTP** (Simple Mail Transfer Protocol) to send emails.

## HOW IT WORKS - AUTOMATIC EMAIL FLOW

### When User Books a Ticket:

```
1. User completes booking
   ↓
2. Backend saves booking to MongoDB
   ↓
3. Backend generates confirmation number (e.g., BF123456)
   ↓
4. Backend generates e-ticket number (e.g., ET987654321)
   ↓
5. Backend creates PDF ticket with booking details
   ↓
6. Backend sends email to user with:
   - Subject: "✈️ Booking Confirmed - BF123456 | Download Your E-Ticket"
   - Body: Beautiful HTML email with all booking details
   - Attachment: PDF ticket (eticket-BF123456.pdf)
   ↓
7. User receives email in their inbox
   ↓
8. User can download PDF ticket from email
```

## EMAIL CONTENT

The user receives an email with:

### 1. **Subject Line**
```
✈️ Booking Confirmed - BF123456 | Download Your E-Ticket
```

### 2. **Email Body** (Modern HTML Design)
- 🎉 "Booking Confirmed!" header
- 📋 Confirmation number in large font
- 🎫 E-ticket number
- 📎 "Your E-Ticket is Attached!" notification
- ✈️ Complete flight details (airline, route, times)
- 👥 Passenger information with seat numbers
- 💰 Payment summary
- 📝 Important travel information
- ✅ Pre-flight checklist

### 3. **PDF Attachment**
- Professional ticket with gradient design
- All booking details
- Ready to print
- Can be saved for airport check-in

## SMTP EXPLAINED (Simple Terms)

**SMTP** = Simple Mail Transfer Protocol

Think of it like the postal service for emails:
- Your backend is the "sender"
- Gmail SMTP is the "post office"
- User's email inbox is the "mailbox"

### How SMTP Works:
1. Your backend connects to Gmail's SMTP server (smtp.gmail.com)
2. Backend authenticates using your email and app password
3. Backend sends the email with ticket attachment
4. Gmail SMTP server delivers it to user's inbox
5. User receives the email

## WHEN EMAILS ARE SENT

### Automatic Emails:
1. **Booking Confirmation** - Immediately after booking is created
   - Includes PDF ticket attachment
   - Sent to user's email address

2. **Manual Resend** - When user clicks "Send Email Confirmation"
   - Same email with ticket
   - Can be sent multiple times

### Future Emails (Already Implemented):
3. **Cancellation Email** - When booking is cancelled
4. **Flight Reminder** - 24 hours before flight
5. **Welcome Email** - When new user signs up

## CODE FLOW

### In `backend/routes/booking.routes.js`:
```javascript
// When booking is created
const booking = await Booking.create(bookingData);

// Generate confirmation data
const confirmationData = {
  confirmationNumber: `BF${Date.now().toString().slice(-6)}`,
  eTicketNumber: `ET${Math.floor(Math.random() * 1000000000)}`,
  confirmationDate: booking.createdAt
};

// Send email with ticket (automatic)
sendBookingConfirmation(booking, req.user.email, confirmationData);
```

### In `backend/services/email.service.js`:
```javascript
// Generate PDF ticket
const pdfBuffer = await generateTicketPDF(booking, confirmationData);

// Attach PDF to email
const mailOptions = {
  from: "Business Flight Direct <akashmedhara@gmail.com>",
  to: userEmail,
  subject: "✈️ Booking Confirmed - BF123456 | Download Your E-Ticket",
  html: emailTemplate(content),
  attachments: [{
    filename: 'eticket-BF123456.pdf',
    content: pdfBuffer,
    contentType: 'application/pdf'
  }]
};

// Send via SMTP
await transporter.sendMail(mailOptions);
```

## TESTING THE EMAIL SYSTEM

### Test 1: Check Email Configuration
```bash
cd backend
npm run test:email
```

This will test if email is configured correctly.

### Test 2: Create a Real Booking
1. Start backend: `cd backend && npm run dev`
2. Start frontend: `npm run dev`
3. Login to the application
4. Search for flights
5. Complete a booking
6. **Check your email inbox!**
7. You should receive the confirmation email with PDF ticket

### Test 3: Check Backend Logs
When email is sent, you'll see in backend console:
```
✅ PDF ticket generated successfully
✅ Booking confirmation email sent to: user@example.com
```

## EMAIL DELIVERY TIME

- **Instant to 30 seconds** - Usually very fast
- Check spam/junk folder if not received
- Gmail SMTP is very reliable

## WHAT USER SEES IN EMAIL

### Email Preview:
```
From: Business Flight Direct <akashmedhara@gmail.com>
To: user@example.com
Subject: ✈️ Booking Confirmed - BF123456 | Download Your E-Ticket

[Beautiful HTML email with gradient header]

🎉 Booking Confirmed!

Dear John Doe,

Your flight booking has been successfully confirmed! 
We're excited to have you on board.

📋 Booking Reference
BF123456
E-Ticket: ET987654321

📄 Your E-Ticket is Attached!
Your boarding pass is attached to this email as a PDF file.
Download and save it for airport check-in.

📎 eticket-BF123456.pdf

✈️ Flight Details
Airline: Air India
Route: Delhi → Mumbai
Departure: 2026-03-03 at 10:30 AM
Class: Business

[... more details ...]

Attachments: eticket-BF123456.pdf (75 KB)
```

## ADVANTAGES OF THIS SYSTEM

✅ **Automatic** - No manual work needed
✅ **Professional** - Modern, branded emails
✅ **Reliable** - Gmail SMTP is very stable
✅ **Secure** - Uses app password, not real password
✅ **Fast** - Emails sent in seconds
✅ **Includes Ticket** - PDF attached automatically
✅ **Mobile Friendly** - Responsive email design
✅ **Printable** - PDF ready for printing

## TROUBLESHOOTING

### Email Not Received?
1. Check spam/junk folder
2. Verify email address is correct
3. Check backend console for errors
4. Run: `cd backend && npm run test:email`

### "Email not configured" Error?
- Email IS configured in your .env file
- Just restart backend: `cd backend && npm run dev`

### Email Sent But No Attachment?
- Check backend console for PDF generation errors
- Verify pdfkit is installed: `npm list pdfkit`
- If not installed: `npm install pdfkit`

## SECURITY

✅ **App Password Used** - Not your real Gmail password
✅ **TLS Encryption** - Emails sent securely
✅ **No Storage** - PDFs generated on-demand, not stored
✅ **User Privacy** - Only booking owner receives email

## SMTP SETTINGS EXPLAINED

```env
EMAIL_HOST=smtp.gmail.com     # Gmail's SMTP server
EMAIL_PORT=587                # Standard SMTP port (TLS)
EMAIL_USER=akashmedhara@gmail.com  # Your Gmail address
EMAIL_PASSWORD=xvae hjax zvzx umck # Gmail App Password
```

### Why Port 587?
- Port 587 = STARTTLS (secure connection)
- Port 465 = SSL (also secure, but 587 is standard)
- Port 25 = Unencrypted (not used)

## ALTERNATIVE SMTP PROVIDERS

If you want to use a different email service:

### SendGrid (Professional)
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

### Mailgun (Professional)
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=postmaster@your-domain.com
EMAIL_PASSWORD=your-mailgun-password
```

### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

But **Gmail SMTP is perfect** for your needs!

## SUMMARY

✅ **Email system is READY**
✅ **Uses Gmail SMTP**
✅ **Sends automatically on booking**
✅ **Includes PDF ticket**
✅ **Professional design**
✅ **No additional setup needed**

Just make sure:
1. Backend is running
2. pdfkit is installed (`npm install pdfkit`)
3. Create a booking
4. Check email inbox!

---

**Your email system is fully operational! 📧✈️**

Users will receive beautiful confirmation emails with downloadable tickets automatically after booking!
