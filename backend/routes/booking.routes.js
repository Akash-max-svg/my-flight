import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import Booking from '../models/Booking.model.js';
import { sendBookingConfirmation, sendCancellationEmail } from '../services/email.service.js';
import { generateTicketPDF } from '../services/ticket.service.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all cancelled bookings for current user (MUST BE BEFORE /:id route)
router.get('/cancelled/all', async (req, res) => {
  try {
    const cancelledBookings = await Booking.find({ 
      user: req.user._id,
      status: 'cancelled'
    }).sort({ 'cancellation.cancelledAt': -1 });
    
    console.log(`📋 Found ${cancelledBookings.length} cancelled bookings for user`);
    
    res.json({ 
      status: 'success', 
      data: { 
        bookings: cancelledBookings,
        count: cancelledBookings.length
      } 
    });
  } catch (error) {
    console.error('❌ Error fetching cancelled bookings:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Get cancellation statistics (MUST BE BEFORE /:id route)
router.get('/cancelled/stats', async (req, res) => {
  try {
    const cancelledBookings = await Booking.find({ 
      user: req.user._id,
      status: 'cancelled'
    });
    
    const stats = {
      totalCancellations: cancelledBookings.length,
      totalRefundAmount: cancelledBookings.reduce((sum, b) => sum + (b.cancellation.refundAmount || 0), 0),
      pendingRefunds: cancelledBookings.filter(b => b.cancellation.refundStatus === 'processing').length,
      completedRefunds: cancelledBookings.filter(b => b.cancellation.refundStatus === 'completed').length,
      recentCancellations: cancelledBookings
        .sort((a, b) => new Date(b.cancellation.cancelledAt) - new Date(a.cancellation.cancelledAt))
        .slice(0, 5)
        .map(b => ({
          bookingId: b.bookingId,
          route: `${b.flight.from} → ${b.flight.to}`,
          cancelledAt: b.cancellation.cancelledAt,
          refundAmount: b.cancellation.refundAmount,
          refundStatus: b.cancellation.refundStatus
        }))
    };
    
    console.log('📊 Cancellation stats:', stats);
    
    res.json({ 
      status: 'success', 
      data: stats
    });
  } catch (error) {
    console.error('❌ Error fetching cancellation stats:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Get all bookings for current user (excluding cancelled)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find({ 
      user: req.user._id,
      status: { $ne: 'cancelled' }  // Exclude cancelled bookings
    }).sort({ bookingDate: -1 });
    res.json({ status: 'success', data: { bookings } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!booking) {
      return res.status(404).json({ status: 'error', message: 'Booking not found' });
    }
    
    res.json({ status: 'success', data: { booking } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Create new booking
router.post('/', async (req, res) => {
  try {
    // Generate bookingId manually to ensure it's set
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const bookingId = `BK${timestamp}${random}`;
    
    // Ensure travelDate is set from flight.departureDate
    const bookingData = {
      ...req.body,
      user: req.user._id,
      bookingId: bookingId,  // Explicitly set bookingId
      travelDate: req.body.flight?.departureDate || req.body.travelDate || new Date()  // Set travelDate from departureDate
    };
    
    // Ensure flight.departureDate is a Date object
    if (bookingData.flight && bookingData.flight.departureDate) {
      bookingData.flight.departureDate = new Date(bookingData.flight.departureDate);
    }
    
    // Ensure travelDate is a Date object
    if (bookingData.travelDate) {
      bookingData.travelDate = new Date(bookingData.travelDate);
    }
    
    console.log('📝 Creating booking with data:', JSON.stringify(bookingData, null, 2));
    console.log('📅 Travel Date (Flight Departure):', bookingData.travelDate);
    console.log('📅 Flight Departure Date:', bookingData.flight?.departureDate);
    
    const booking = await Booking.create(bookingData);
    
    console.log('✅ Booking created successfully:', booking.bookingId);
    console.log('✅ Travel Date saved:', booking.travelDate);
    
    // Send confirmation email (don't wait for it)
    sendBookingConfirmation(booking, req.user.email).catch(err => 
      console.error('Email sending failed:', err)
    );
    
    res.status(201).json({ 
      status: 'success', 
      data: { 
        booking
      } 
    });
  } catch (error) {
    console.error('❌ Booking creation error:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      errors: error.errors,
      stack: error.stack
    });
    res.status(500).json({ 
      status: 'error', 
      message: error.message,
      details: error.errors || {}
    });
  }
});

// Cancel booking (3-day policy enforced) - SAVES TO MONGODB
router.post('/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!booking) {
      return res.status(404).json({ status: 'error', message: 'Booking not found' });
    }
    
    // Check if booking can be cancelled (3-day policy)
    const now = new Date();
    const travel = new Date(booking.travelDate);
    const hoursUntilTravel = (travel - now) / (1000 * 60 * 60);
    const daysUntilTravel = Math.floor(hoursUntilTravel / 24);
    
    if (hoursUntilTravel <= 72) {
      return res.status(400).json({ 
        status: 'error', 
        message: `Cancellation not allowed. Bookings can only be cancelled at least 3 days (72 hours) before the flight. Your flight is in ${daysUntilTravel} days and ${Math.floor(hoursUntilTravel % 24)} hours.`,
        canCancel: false,
        hoursUntilTravel: Math.floor(hoursUntilTravel),
        daysUntilTravel: daysUntilTravel
      });
    }
    
    // Calculate refund amount before cancellation
    const refundAmount = booking.calculateRefund();
    
    // Update booking with cancellation data and save to MongoDB
    booking.status = 'cancelled';
    booking.cancellation.isCancelled = true;
    booking.cancellation.cancelledAt = new Date();
    booking.cancellation.cancellationReason = req.body.reason || 'User requested cancellation';
    booking.cancellation.refundAmount = refundAmount;
    booking.cancellation.refundStatus = 'processing';
    
    // Save to MongoDB
    await booking.save();
    
    console.log('✅ Cancellation saved to MongoDB:', {
      bookingId: booking.bookingId,
      cancelledAt: booking.cancellation.cancelledAt,
      refundAmount: booking.cancellation.refundAmount,
      reason: booking.cancellation.cancellationReason
    });
    
    // Send cancellation email (don't wait for it)
    sendCancellationEmail(booking, req.user.email).catch(err => 
      console.error('Email sending failed:', err)
    );
    
    res.json({ 
      status: 'success', 
      message: 'Booking cancelled successfully and saved to database',
      data: { 
        booking,
        refundAmount,
        refundStatus: booking.cancellation.refundStatus,
        cancelledAt: booking.cancellation.cancelledAt
      }
    });
  } catch (error) {
    console.error('❌ Cancellation error:', error);
    res.status(400).json({ 
      status: 'error', 
      message: error.message || 'Failed to cancel booking'
    });
  }
});

// Check if booking can be cancelled (3-day policy)
router.get('/:id/can-cancel', async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!booking) {
      return res.status(404).json({ status: 'error', message: 'Booking not found' });
    }
    
    const now = new Date();
    const travel = new Date(booking.travelDate);
    const hoursUntilTravel = (travel - now) / (1000 * 60 * 60);
    const daysUntilTravel = Math.floor(hoursUntilTravel / 24);
    const canCancel = hoursUntilTravel > 72 && booking.status !== 'cancelled' && booking.status !== 'completed';
    
    let message = '';
    if (booking.status === 'cancelled') {
      message = 'Booking is already cancelled';
    } else if (booking.status === 'completed') {
      message = 'Cannot cancel completed booking';
    } else if (hoursUntilTravel <= 72) {
      message = `Cancellation not allowed. Bookings can only be cancelled at least 3 days (72 hours) before the flight. Your flight is in ${daysUntilTravel} days and ${Math.floor(hoursUntilTravel % 24)} hours.`;
    } else {
      message = 'Booking can be cancelled';
    }
    
    const refundAmount = canCancel ? booking.calculateRefund() : 0;
    
    res.json({ 
      status: 'success', 
      data: {
        canCancel,
        message,
        hoursUntilTravel: Math.floor(hoursUntilTravel),
        daysUntilTravel,
        refundAmount,
        bookingStatus: booking.status,
        travelDate: booking.travelDate
      }
    });
  } catch (error) {
    console.error('❌ Can-cancel check error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Download ticket PDF
router.get('/:id/ticket', async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!booking) {
      return res.status(404).json({ status: 'error', message: 'Booking not found' });
    }
    
    // Generate confirmation data
    const confirmationData = {
      confirmationNumber: req.query.confirmationNumber || `BF${Date.now().toString().slice(-6)}`,
      eTicketNumber: req.query.eTicketNumber || `ET${Math.floor(Math.random() * 1000000000)}`,
      confirmationDate: booking.createdAt || new Date().toISOString()
    };
    
    // Generate PDF
    const pdfBuffer = await generateTicketPDF(booking, confirmationData);
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=eticket-${confirmationData.confirmationNumber}.pdf`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // Send PDF
    res.send(pdfBuffer);
    
    console.log('✅ Ticket PDF downloaded for booking:', booking.bookingId);
  } catch (error) {
    console.error('❌ Ticket download error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Resend confirmation email with ticket
router.post('/:id/resend-email', async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!booking) {
      return res.status(404).json({ status: 'error', message: 'Booking not found' });
    }
    
    // Generate confirmation data
    const confirmationData = {
      confirmationNumber: req.body.confirmationNumber || `BF${Date.now().toString().slice(-6)}`,
      eTicketNumber: req.body.eTicketNumber || `ET${Math.floor(Math.random() * 1000000000)}`,
      confirmationDate: booking.createdAt || new Date().toISOString()
    };
    
    // Send email with ticket
    const emailSent = await sendBookingConfirmation(booking, req.user.email, confirmationData);
    
    if (emailSent) {
      res.json({ 
        status: 'success', 
        message: 'Confirmation email sent successfully with ticket attachment'
      });
    } else {
      res.status(500).json({ 
        status: 'error', 
        message: 'Failed to send email. Please check email configuration.'
      });
    }
  } catch (error) {
    console.error('❌ Email resend error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
