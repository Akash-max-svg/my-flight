import pkg from 'nodemailer';
const { createTransport } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Email configuration check
const isEmailConfigured = () => {
  return !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);
};

// Create email transporter
const createTransporter = () => {
  if (!isEmailConfigured()) {
    console.warn('⚠️ Email service not configured. Set EMAIL_USER and EMAIL_PASSWORD in .env');
    return null;
  }

  try {
    const transporter = createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false // For development only
      }
    });
    
    return transporter;
  } catch (error) {
    console.error('Error creating email transporter:', error);
    return null;
  }
};

// Email template wrapper
const emailTemplate = (content, title) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">✈️ Flight Booking System</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="color: #6c757d; font-size: 12px; margin: 0 0 10px 0;">
                This is an automated email. Please do not reply to this message.
              </p>
              <p style="color: #6c757d; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Flight Booking System. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// Send booking confirmation email
export const sendBookingConfirmation = async (booking, userEmail) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log('📧 Email not configured - skipping booking confirmation email');
      return false;
    }
    
    const content = `
      <h2 style="color: #28a745; margin-top: 0;">🎉 Booking Confirmed!</h2>
      <p style="font-size: 16px; color: #333;">Dear ${booking.passengers[0]?.name || 'Passenger'},</p>
      <p style="font-size: 14px; color: #666; line-height: 1.6;">
        Your flight booking has been successfully confirmed! We're excited to have you on board.
      </p>
      
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px; margin: 25px 0; color: white;">
        <h3 style="margin: 0 0 15px 0; font-size: 18px;">📋 Booking Reference</h3>
        <p style="font-size: 24px; font-weight: bold; margin: 0; letter-spacing: 2px;">${booking.bookingId}</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea;">
        <h3 style="margin-top: 0; color: #333;">✈️ Flight Details</h3>
        <table width="100%" cellpadding="8" cellspacing="0" style="font-size: 14px;">
          <tr>
            <td style="color: #666; width: 40%;"><strong>Airline:</strong></td>
            <td style="color: #333;">${booking.flight.airline}</td>
          </tr>
          <tr>
            <td style="color: #666;"><strong>Flight Number:</strong></td>
            <td style="color: #333;">${booking.flight.flightNumber || 'N/A'}</td>
          </tr>
          <tr>
            <td style="color: #666;"><strong>Route:</strong></td>
            <td style="color: #333;"><strong>${booking.flight.from}</strong> → <strong>${booking.flight.to}</strong></td>
          </tr>
          <tr>
            <td style="color: #666;"><strong>Departure:</strong></td>
            <td style="color: #333;">${booking.flight.departureDate || 'N/A'} at ${booking.flight.departure}</td>
          </tr>
          <tr>
            <td style="color: #666;"><strong>Arrival:</strong></td>
            <td style="color: #333;">${booking.flight.arrivalDate || 'N/A'} at ${booking.flight.arrival}</td>
          </tr>
          <tr>
            <td style="color: #666;"><strong>Class:</strong></td>
            <td style="color: #333;">${booking.flight.class}</td>
          </tr>
          <tr>
            <td style="color: #666;"><strong>Duration:</strong></td>
            <td style="color: #333;">${booking.flight.time || 'N/A'}</td>
          </tr>
        </table>
      </div>
      
      <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ffc107;">
        <h3 style="margin-top: 0; color: #856404;">👥 Passenger Information</h3>
        ${booking.passengers.map((passenger, index) => `
          <div style="margin-bottom: 15px; padding-bottom: 15px; ${index < booking.passengers.length - 1 ? 'border-bottom: 1px solid #e9ecef;' : ''}">
            <p style="margin: 5px 0; color: #333;"><strong>Passenger ${index + 1}:</strong> ${passenger.name}</p>
            <p style="margin: 5px 0; color: #666; font-size: 13px;">Age: ${passenger.age} | Gender: ${passenger.gender}</p>
            ${passenger.seatNumber ? `<p style="margin: 5px 0; color: #666; font-size: 13px;">Seat: ${passenger.seatNumber}</p>` : ''}
          </div>
        `).join('')}
      </div>
      
      <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #28a745;">
        <h3 style="margin-top: 0; color: #155724;">💰 Payment Summary</h3>
        <table width="100%" cellpadding="5" cellspacing="0" style="font-size: 14px;">
          <tr>
            <td style="color: #666;">Base Fare:</td>
            <td style="text-align: right; color: #333;">₹${booking.pricing.basePrice.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="color: #666;">Taxes & Fees:</td>
            <td style="text-align: right; color: #333;">₹${booking.pricing.taxes.toLocaleString()}</td>
          </tr>
          ${booking.pricing.discount > 0 ? `
          <tr>
            <td style="color: #28a745;">Discount:</td>
            <td style="text-align: right; color: #28a745;">-₹${booking.pricing.discount.toLocaleString()}</td>
          </tr>
          ` : ''}
          <tr style="border-top: 2px solid #28a745;">
            <td style="color: #155724; font-weight: bold; padding-top: 10px;">Total Amount Paid:</td>
            <td style="text-align: right; color: #155724; font-weight: bold; font-size: 18px; padding-top: 10px;">₹${booking.pricing.totalPrice.toLocaleString()}</td>
          </tr>
        </table>
      </div>
      
      <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #0066cc;">
        <h3 style="margin-top: 0; color: #004085;">📝 Important Information</h3>
        <ul style="margin: 10px 0; padding-left: 20px; color: #666; line-height: 1.8;">
          <li>Please arrive at the airport at least <strong>2-3 hours</strong> before departure</li>
          <li>Carry a valid <strong>government-issued photo ID</strong></li>
          <li>Complete <strong>web check-in</strong> 24 hours before departure</li>
          <li>Review your airline's <strong>baggage policy</strong></li>
          <li>Keep your booking reference handy: <strong>${booking.bookingId}</strong></li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <p style="font-size: 16px; color: #333; margin-bottom: 10px;">Have a wonderful journey! ✈️</p>
        <p style="font-size: 14px; color: #666;">For any queries, please contact our support team.</p>
      </div>
    `;
    
    const mailOptions = {
      from: `"Flight Booking System" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `✈️ Booking Confirmed - ${booking.bookingId}`,
      html: emailTemplate(content, 'Booking Confirmation')
    };
    
    await transporter.sendMail(mailOptions);
    console.log('✅ Booking confirmation email sent to:', userEmail);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return false;
  }
};

// Send cancellation email
export const sendCancellationEmail = async (booking, userEmail) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log('📧 Email not configured - skipping cancellation email');
      return false;
    }
    
    const content = `
      <h2 style="color: #dc3545; margin-top: 0;">❌ Booking Cancelled</h2>
      <p style="font-size: 16px; color: #333;">Dear ${booking.passengers[0]?.name || 'Passenger'},</p>
      <p style="font-size: 14px; color: #666; line-height: 1.6;">
        Your booking has been cancelled as requested. We're sorry to see you go.
      </p>
      
      <div style="background: #dc3545; padding: 20px; border-radius: 8px; margin: 25px 0; color: white;">
        <h3 style="margin: 0 0 15px 0; font-size: 18px;">📋 Cancelled Booking</h3>
        <p style="font-size: 24px; font-weight: bold; margin: 0; letter-spacing: 2px;">${booking.bookingId}</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #dc3545;">
        <h3 style="margin-top: 0; color: #333;">✈️ Flight Details</h3>
        <table width="100%" cellpadding="8" cellspacing="0" style="font-size: 14px;">
          <tr>
            <td style="color: #666; width: 40%;"><strong>Airline:</strong></td>
            <td style="color: #333;">${booking.flight.airline}</td>
          </tr>
          <tr>
            <td style="color: #666;"><strong>Route:</strong></td>
            <td style="color: #333;"><strong>${booking.flight.from}</strong> → <strong>${booking.flight.to}</strong></td>
          </tr>
          <tr>
            <td style="color: #666;"><strong>Departure:</strong></td>
            <td style="color: #333;">${booking.flight.departureDate || 'N/A'} at ${booking.flight.departure}</td>
          </tr>
          <tr>
            <td style="color: #666;"><strong>Class:</strong></td>
            <td style="color: #333;">${booking.flight.class}</td>
          </tr>
        </table>
      </div>
      
      <div style="background: #d1ecf1; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #17a2b8;">
        <h3 style="margin-top: 0; color: #0c5460;">💰 Refund Information</h3>
        <table width="100%" cellpadding="8" cellspacing="0" style="font-size: 14px;">
          <tr>
            <td style="color: #666; width: 50%;"><strong>Original Amount:</strong></td>
            <td style="text-align: right; color: #333;">₹${booking.pricing.totalPrice.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="color: #666;"><strong>Cancellation Fee:</strong></td>
            <td style="text-align: right; color: #dc3545;">-₹${(booking.cancellation?.cancellationFee || 0).toLocaleString()}</td>
          </tr>
          <tr style="border-top: 2px solid #17a2b8;">
            <td style="color: #0c5460; font-weight: bold; padding-top: 10px;"><strong>Refund Amount:</strong></td>
            <td style="text-align: right; color: #0c5460; font-weight: bold; font-size: 18px; padding-top: 10px;">₹${(booking.cancellation?.refundAmount || 0).toLocaleString()}</td>
          </tr>
          <tr>
            <td style="color: #666;"><strong>Refund Status:</strong></td>
            <td style="text-align: right; color: #28a745; font-weight: bold;">${booking.cancellation?.refundStatus || 'Processing'}</td>
          </tr>
        </table>
      </div>
      
      <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ffc107;">
        <h3 style="margin-top: 0; color: #856404;">📝 Cancellation Details</h3>
        <p style="margin: 5px 0; color: #666;"><strong>Cancelled On:</strong> ${new Date(booking.cancellation?.cancelledAt || Date.now()).toLocaleString()}</p>
        <p style="margin: 5px 0; color: #666;"><strong>Reason:</strong> ${booking.cancellation?.reason || 'User requested cancellation'}</p>
        <p style="margin: 15px 0 5px 0; color: #666; font-size: 13px;">
          Your refund will be processed within <strong>5-7 business days</strong> to your original payment method.
        </p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <p style="font-size: 14px; color: #666;">We hope to serve you again in the future!</p>
        <p style="font-size: 14px; color: #666;">For any queries, please contact our support team.</p>
      </div>
    `;
    
    const mailOptions = {
      from: `"Flight Booking System" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `❌ Booking Cancelled - ${booking.bookingId}`,
      html: emailTemplate(content, 'Booking Cancellation')
    };
    
    await transporter.sendMail(mailOptions);
    console.log('✅ Cancellation email sent to:', userEmail);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return false;
  }
};

// Send flight reminder email (24 hours before)
export const sendFlightReminder = async (booking, userEmail) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log('📧 Email not configured - skipping flight reminder email');
      return false;
    }
    
    const content = `
      <h2 style="color: #0066cc; margin-top: 0;">⏰ Flight Reminder</h2>
      <p style="font-size: 16px; color: #333;">Dear ${booking.passengers[0]?.name || 'Passenger'},</p>
      <p style="font-size: 14px; color: #666; line-height: 1.6;">
        This is a friendly reminder that your flight is <strong>tomorrow</strong>! Please review your flight details below.
      </p>
      
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px; margin: 25px 0; color: white;">
        <h3 style="margin: 0 0 15px 0; font-size: 18px;">📋 Booking Reference</h3>
        <p style="font-size: 24px; font-weight: bold; margin: 0; letter-spacing: 2px;">${booking.bookingId}</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea;">
        <h3 style="margin-top: 0; color: #333;">✈️ Flight Details</h3>
        <table width="100%" cellpadding="8" cellspacing="0" style="font-size: 14px;">
          <tr>
            <td style="color: #666; width: 40%;"><strong>Airline:</strong></td>
            <td style="color: #333;">${booking.flight.airline}</td>
          </tr>
          <tr>
            <td style="color: #666;"><strong>Route:</strong></td>
            <td style="color: #333;"><strong>${booking.flight.from}</strong> → <strong>${booking.flight.to}</strong></td>
          </tr>
          <tr>
            <td style="color: #666;"><strong>Departure:</strong></td>
            <td style="color: #333; font-weight: bold; font-size: 16px;">${booking.flight.departureDate || 'Tomorrow'} at ${booking.flight.departure}</td>
          </tr>
          <tr>
            <td style="color: #666;"><strong>Class:</strong></td>
            <td style="color: #333;">${booking.flight.class}</td>
          </tr>
        </table>
      </div>
      
      <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ffc107;">
        <h3 style="margin-top: 0; color: #856404;">✅ Pre-Flight Checklist</h3>
        <ul style="margin: 10px 0; padding-left: 20px; color: #666; line-height: 1.8;">
          <li>✈️ Arrive at the airport <strong>2-3 hours before departure</strong></li>
          <li>🆔 Carry a valid <strong>government-issued photo ID</strong></li>
          <li>📱 Complete <strong>web check-in</strong> if not done already</li>
          <li>🧳 Review <strong>baggage allowance</strong> and restrictions</li>
          <li>📄 Keep your <strong>booking reference</strong> handy</li>
          <li>💳 Carry your <strong>payment card</strong> used for booking</li>
          <li>😷 Check <strong>COVID-19 requirements</strong> if applicable</li>
        </ul>
      </div>
      
      <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #0066cc;">
        <h3 style="margin-top: 0; color: #004085;">💡 Travel Tips</h3>
        <ul style="margin: 10px 0; padding-left: 20px; color: #666; line-height: 1.8;">
          <li>Check real-time flight status before leaving for airport</li>
          <li>Download your airline's mobile app for updates</li>
          <li>Keep emergency contact numbers handy</li>
          <li>Arrive early to avoid last-minute rush</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <p style="font-size: 16px; color: #333; margin-bottom: 10px;">Have a safe and pleasant journey! ✈️</p>
        <p style="font-size: 14px; color: #666;">Bon Voyage!</p>
      </div>
    `;
    
    const mailOptions = {
      from: `"Flight Booking System" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `⏰ Flight Reminder - Tomorrow's Flight (${booking.bookingId})`,
      html: emailTemplate(content, 'Flight Reminder')
    };
    
    await transporter.sendMail(mailOptions);
    console.log('✅ Flight reminder email sent to:', userEmail);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return false;
  }
};

// Send welcome email to new users
export const sendWelcomeEmail = async (user) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log('📧 Email not configured - skipping welcome email');
      return false;
    }
    
    const content = `
      <h2 style="color: #28a745; margin-top: 0;">🎉 Welcome Aboard!</h2>
      <p style="font-size: 16px; color: #333;">Dear ${user.username},</p>
      <p style="font-size: 14px; color: #666; line-height: 1.6;">
        Thank you for registering with <strong>Flight Booking System</strong>! We're thrilled to have you as part of our travel community.
      </p>
      
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 8px; margin: 25px 0; color: white; text-align: center;">
        <h3 style="margin: 0 0 10px 0; font-size: 20px;">Your Account is Ready!</h3>
        <p style="margin: 0; font-size: 14px; opacity: 0.9;">Start exploring amazing flight deals</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #28a745;">
        <h3 style="margin-top: 0; color: #333;">🎯 What You Can Do</h3>
        <ul style="margin: 10px 0; padding-left: 20px; color: #666; line-height: 1.8;">
          <li>✈️ Search and book flights to 100+ destinations</li>
          <li>💺 Choose your preferred seats</li>
          <li>💰 Get exclusive discounts and offers</li>
          <li>📱 Manage bookings easily from your dashboard</li>
          <li>🎁 Earn loyalty points on every booking</li>
        </ul>
      </div>
      
      <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #0066cc;">
        <h3 style="margin-top: 0; color: #004085;">📧 Account Details</h3>
        <p style="margin: 5px 0; color: #666;"><strong>Username:</strong> ${user.username}</p>
        <p style="margin: 5px 0; color: #666;"><strong>Email:</strong> ${user.email}</p>
        <p style="margin: 15px 0 5px 0; color: #666; font-size: 13px;">
          Keep your login credentials safe and secure.
        </p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <p style="font-size: 16px; color: #333; margin-bottom: 10px;">Ready to explore the world? ✈️</p>
        <p style="font-size: 14px; color: #666;">Start booking your next adventure today!</p>
      </div>
    `;
    
    const mailOptions = {
      from: `"Flight Booking System" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '🎉 Welcome to Flight Booking System!',
      html: emailTemplate(content, 'Welcome')
    };
    
    await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent to:', user.email);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return false;
  }
};

// Send booking update email
export const sendBookingUpdateEmail = async (booking, userEmail, updateType, updateDetails) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log('📧 Email not configured - skipping booking update email');
      return false;
    }
    
    const content = `
      <h2 style="color: #ffc107; margin-top: 0;">📢 Booking Update</h2>
      <p style="font-size: 16px; color: #333;">Dear ${booking.passengers[0]?.name || 'Passenger'},</p>
      <p style="font-size: 14px; color: #666; line-height: 1.6;">
        There has been an update to your booking. Please review the details below.
      </p>
      
      <div style="background: #ffc107; padding: 20px; border-radius: 8px; margin: 25px 0; color: #000;">
        <h3 style="margin: 0 0 15px 0; font-size: 18px;">📋 Booking Reference</h3>
        <p style="font-size: 24px; font-weight: bold; margin: 0; letter-spacing: 2px;">${booking.bookingId}</p>
      </div>
      
      <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ffc107;">
        <h3 style="margin-top: 0; color: #856404;">📝 Update Details</h3>
        <p style="margin: 5px 0; color: #666;"><strong>Update Type:</strong> ${updateType}</p>
        <p style="margin: 5px 0; color: #666;"><strong>Details:</strong> ${updateDetails}</p>
        <p style="margin: 5px 0; color: #666;"><strong>Updated On:</strong> ${new Date().toLocaleString()}</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea;">
        <h3 style="margin-top: 0; color: #333;">✈️ Current Flight Details</h3>
        <table width="100%" cellpadding="8" cellspacing="0" style="font-size: 14px;">
          <tr>
            <td style="color: #666; width: 40%;"><strong>Airline:</strong></td>
            <td style="color: #333;">${booking.flight.airline}</td>
          </tr>
          <tr>
            <td style="color: #666;"><strong>Route:</strong></td>
            <td style="color: #333;"><strong>${booking.flight.from}</strong> → <strong>${booking.flight.to}</strong></td>
          </tr>
          <tr>
            <td style="color: #666;"><strong>Departure:</strong></td>
            <td style="color: #333;">${booking.flight.departureDate || 'N/A'} at ${booking.flight.departure}</td>
          </tr>
          <tr>
            <td style="color: #666;"><strong>Status:</strong></td>
            <td style="color: #333; font-weight: bold;">${booking.status}</td>
          </tr>
        </table>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <p style="font-size: 14px; color: #666;">For any questions, please contact our support team.</p>
      </div>
    `;
    
    const mailOptions = {
      from: `"Flight Booking System" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `📢 Booking Update - ${booking.bookingId}`,
      html: emailTemplate(content, 'Booking Update')
    };
    
    await transporter.sendMail(mailOptions);
    console.log('✅ Booking update email sent to:', userEmail);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return false;
  }
};

// Test email configuration
export const testEmailConfiguration = async () => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      return {
        success: false,
        message: 'Email not configured. Please set EMAIL_USER and EMAIL_PASSWORD in .env'
      };
    }
    
    await transporter.verify();
    return {
      success: true,
      message: 'Email configuration is valid and ready to send emails'
    };
  } catch (error) {
    return {
      success: false,
      message: `Email configuration error: ${error.message}`
    };
  }
};

export default {
  sendBookingConfirmation,
  sendCancellationEmail,
  sendFlightReminder,
  sendWelcomeEmail,
  sendBookingUpdateEmail,
  testEmailConfiguration,
  isEmailConfigured
};
