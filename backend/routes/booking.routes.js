import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import Booking from '../models/Booking.model.js';
import { sendBookingConfirmation, sendCancellationEmail } from '../services/email.service.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all bookings for current user
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ bookingDate: -1 });
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
    const bookingData = {
      ...req.body,
      user: req.user._id
    };
    
    const booking = await Booking.create(bookingData);
    
    // Send confirmation email (don't wait for it)
    sendBookingConfirmation(booking, req.user.email).catch(err => 
      console.error('Email sending failed:', err)
    );
    
    res.status(201).json({ status: 'success', data: { booking } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Cancel booking
router.post('/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!booking) {
      return res.status(404).json({ status: 'error', message: 'Booking not found' });
    }
    
    await booking.cancelBooking(req.body.reason || 'User requested cancellation');
    
    // Send cancellation email (don't wait for it)
    sendCancellationEmail(booking, req.user.email).catch(err => 
      console.error('Email sending failed:', err)
    );
    
    res.json({ 
      status: 'success', 
      message: 'Booking cancelled successfully',
      data: { booking }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
