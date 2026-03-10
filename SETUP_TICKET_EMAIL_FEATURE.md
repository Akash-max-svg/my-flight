# 🚀 QUICK SETUP GUIDE - Ticket Download & Email Feature

## STEP 1: Install Dependencies

Open terminal in backend folder and run:

```bash
cd backend
npm install pdfkit
```

## STEP 2: Configure Email (Gmail Example)

### For Gmail Users:

1. **Enable 2-Factor Authentication**
   - Go to Google Account Settings
   - Security → 2-Step Verification
   - Turn it ON

2. **Generate App Password**
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and "Windows Computer" (or Other)
   - Click "Generate"
   - Copy the 16-character password

3. **Update backend/.env file**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   ```

### For Other Email Providers:

**Outlook/Hotmail:**
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

**Yahoo:**
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-app-password
```

## STEP 3: Restart Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

## STEP 4: Test the Feature

### Test 1: Create a Booking
1. Start frontend: `npm run dev`
2. Login to the application
3. Search for flights
4. Complete a booking
5. Check your email inbox
6. You should receive an email with PDF ticket attached!

### Test 2: Download Ticket
1. Go to booking confirmation page
2. Click "📄 Download E-Ticket" button
3. PDF ticket should download
4. Open the PDF and verify all details

### Test 3: Resend Email
1. On confirmation page
2. Click "📧 Send Email Confirmation"
3. Check email inbox
4. New email with ticket should arrive

## VERIFICATION CHECKLIST

✅ pdfkit installed in backend
✅ Email credentials configured in backend/.env
✅ Backend server running without errors
✅ Frontend can access backend API
✅ Email received with PDF attachment
✅ PDF ticket downloads successfully
✅ All booking details appear correctly in PDF

## TROUBLESHOOTING

### "Email not configured" message
- Check EMAIL_USER and EMAIL_PASSWORD in backend/.env
- Make sure there are no spaces or quotes around values
- Restart backend server after changing .env

### Email not received
- Check spam/junk folder
- Verify email address is correct
- Check backend console for email sending logs
- Test email config: `cd backend && npm run test:email`

### PDF not downloading
- Check browser allows downloads
- Check browser console for errors (F12)
- Verify you're logged in
- Check backend console for PDF generation errors

### "Failed to generate ticket" error
- Make sure pdfkit is installed: `npm list pdfkit`
- Check backend console for detailed error
- Verify booking data is complete

## WHAT YOU GET

### Email Features
- ✅ Automatic email on booking
- ✅ PDF ticket attached
- ✅ Modern, professional design
- ✅ Complete flight information
- ✅ Passenger details
- ✅ Payment summary
- ✅ Travel checklist

### PDF Ticket Features
- ✅ Modern gradient design
- ✅ Confirmation number
- ✅ E-ticket number
- ✅ Flight details
- ✅ Passenger information
- ✅ Seat assignments
- ✅ Booking summary
- ✅ Important information
- ✅ Ready to print

### User Actions
- ✅ Download ticket anytime
- ✅ Resend email anytime
- ✅ Print ticket for airport
- ✅ Save ticket for records

## EXAMPLE EMAIL SUBJECT

```
✈️ Booking Confirmed - BF123456 | Download Your E-Ticket
```

## EXAMPLE PDF FILENAME

```
eticket-BF123456.pdf
```

## SUPPORT

If you encounter any issues:

1. Check backend console for errors
2. Check browser console (F12) for errors
3. Verify all environment variables are set
4. Make sure backend and frontend are both running
5. Check email spam folder

## SUCCESS INDICATORS

When everything is working:

1. ✅ Backend logs: "✅ PDF ticket generated successfully"
2. ✅ Backend logs: "✅ Booking confirmation email sent to: user@email.com"
3. ✅ Frontend toast: "✅ E-Ticket downloaded successfully!"
4. ✅ Email received with PDF attachment
5. ✅ PDF opens and displays correctly

---

**You're all set! 🎉**

Users can now download professional tickets and receive them via email!
