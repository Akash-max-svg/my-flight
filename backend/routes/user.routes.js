import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import User from '../models/User.model.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all users (admin only)
router.get('/', authorize('admin'), async (req, res) => {
  res.json({ status: 'success', message: 'Get all users endpoint' });
});

// Get user by ID with full details
router.get('/:id', async (req, res) => {
  try {
    // Verify user is accessing their own profile or is admin
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to access this profile'
      });
    }

    const user = await User.findById(req.params.id).select('-password -refreshToken -passwordResetToken -emailVerificationToken');
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    console.log('✅ User profile fetched:', user.email);

    res.json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    console.error('❌ Get user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching user',
      error: error.message
    });
  }
});

// Get user statistics
router.get('/:id/stats', async (req, res) => {
  try {
    // Verify user is accessing their own stats or is admin
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to access these statistics'
      });
    }

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Get booking statistics
    const Booking = (await import('../models/Booking.model.js')).default;
    const bookings = await Booking.find({ user: req.params.id });
    
    const now = new Date();
    const upcomingFlights = bookings.filter(b => 
      b.status === 'confirmed' && new Date(b.travelDate) > now
    ).length;
    
    const completedFlights = bookings.filter(b => 
      b.status === 'completed' || (b.status === 'confirmed' && new Date(b.travelDate) < now)
    ).length;

    const stats = {
      totalBookings: user.totalBookings || bookings.length,
      totalSpent: user.totalSpent || bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
      loyaltyPoints: user.loyaltyPoints || 0,
      upcomingFlights,
      completedFlights,
      cancelledBookings: bookings.filter(b => b.status === 'cancelled').length,
      memberSince: user.createdAt,
      lastLogin: user.lastLogin
    };

    console.log('✅ User stats fetched:', stats);

    res.json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    console.error('❌ Get user stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching user statistics',
      error: error.message
    });
  }
});

// Update user profile
router.put('/:id', async (req, res) => {
  try {
    // Verify user is updating their own profile or is admin
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this profile'
      });
    }

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Fields that can be updated
    const allowedUpdates = ['username', 'mobile', 'age', 'gender', 'country', 'dob', 'profileImage', 'preferences'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Update user
    Object.assign(user, updates);
    await user.save();

    console.log('✅ User profile updated:', user.email);

    res.json({
      status: 'success',
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('❌ Update user error:', error);
    res.status(400).json({
      status: 'error',
      message: 'Error updating user',
      error: error.message
    });
  }
});

// Delete user (admin only)
router.delete('/:id', authorize('admin'), async (req, res) => {
  res.json({ status: 'success', message: 'Delete user endpoint' });
});

export default router;
