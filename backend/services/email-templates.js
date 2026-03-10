export const createBookingEmailHTML = (booking, confirmation, downloadUrl, viewBookingUrl) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px; }
    .info-box { background: #f8f9fa; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 5px; }
    .info-box h3 { margin: 0 0 10px 0; color: #667eea; }
    .flight-details { display: flex; justify-content: space-between; align-items: center; margin: 20px 0; padding: 20px; background: #f0f4ff; border-radius: 8px; }
    .location { text-align: center; flex: 1; }
    .location .city { font-size: 24px; font-weight: bold; color: #333; }
    .location .time { color: #666; margin-top: 5px; }
    .arrow { font-size: 24px; color: #667eea; margin: 0 20px; }
    .button { display: inline-block; padding: 12px 30px; margin: 10px 5px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
    .button.secondary { background: #764ba2; }
    .button:hover { opacity: 0.9; }
    .important { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
    .download-options { background: #e7f3ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .download-options h3 { color: #667eea; margin-top: 0; }
    .download-options ul { padding-left: 20px; }
    .download-options li { margin: 8px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✈️ Booking Confirmed!</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px;">Your flight ticket is ready</p>
    </div>
    
    <div class="content">
      <div class="info-box">
        <h3>📋 Confirmation Details</h3>
        <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
        <p><strong>Confirmation Number:</strong> ${confirmation.confirmationNumber}</p>
        <p><strong>E-Ticket Number:</strong> ${confirmation.eTicketNumber}</p>
        <p><strong>Booking Date:</strong> ${new Date(booking.bookingDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
      </div>

      <div class="flight-details">
        <div class="location">
          <div class="city">${booking.flight.from}</div>
          <div class="time">${booking.flight.departure}</div>
          <div class="time">${new Date(booking.flight.departureDate || booking.bookingDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</div>
        </div>
        <div class="arrow">→</div>
        <div class="location">
          <div class="city">${booking.flight.to}</div>
          <div class="time">${booking.flight.arrival}</div>
          <div class="time">${new Date(booking.flight.arrivalDate || booking.bookingDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</div>
        </div>
      </div>

      <div class="info-box">
        <h3>✈️ Flight Information</h3>
        <p><strong>Airline:</strong> ${booking.flight.airline}</p>
        <p><strong>Aircraft:</strong> ${booking.flight.aircraft || 'N/A'}</p>
        <p><strong>Class:</strong> ${booking.flight.class}</p>
        <p><strong>Duration:</strong> ${booking.flight.time || booking.flight.duration || 'N/A'}</p>
      </div>

      <div class="info-box">
        <h3>👥 Passenger Details</h3>
        ${booking.passengers.map((p, i) => `
          <p><strong>Passenger ${i + 1}:</strong> ${p.firstName} ${p.lastName} (Age: ${p.age}, ${p.gender})${p.seatNumber ? ` - Seat: ${p.seatNumber}` : ''}</p>
        `).join('')}
      </div>

      <div class="info-box">
        <h3>💰 Payment Summary</h3>
        <p><strong>Total Amount Paid:</strong> ₹${booking.totalPrice?.toLocaleString('en-IN')}</p>
        <p><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">CONFIRMED</span></p>
      </div>

      <div class="download-options">
        <h3>📥 Download Your E-Ticket</h3>
        <p>Your e-ticket PDF is attached to this email. You can also download it using these options:</p>
        <ul>
          <li><strong>Option 1:</strong> Open the PDF attachment in this email</li>
          <li><strong>Option 2:</strong> Click the "Download Ticket PDF" button below</li>
          <li><strong>Option 3:</strong> View your booking details online and download from there</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${downloadUrl}" class="button">📥 Download Ticket PDF</a>
        <a href="${viewBookingUrl}" class="button secondary">🔍 View Booking Details</a>
      </div>

      <div class="important">
        <h3 style="margin-top: 0; color: #856404;">⚠️ Important Travel Information</h3>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>Arrive at airport 2-3 hours before departure</li>
          <li>Carry valid government-issued photo ID</li>
          <li>Complete web check-in 24 hours before departure</li>
          <li>Review baggage allowance and restrictions</li>
          <li>Keep this e-ticket for airport check-in</li>
        </ul>
      </div>
    </div>

    <div class="footer">
      <p><strong>Business Flight Direct</strong></p>
      <p>Email: support@akgroup.com | Phone: +91-6301616095</p>
      <p style="margin-top: 10px;">This is an automated email. Please do not reply.</p>
      <p>Generated on ${new Date().toLocaleString('en-IN')}</p>
    </div>
  </div>
</body>
</html>
  `;
};
