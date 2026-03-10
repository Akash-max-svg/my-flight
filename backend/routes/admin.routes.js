import express from 'express';
import User from '../models/User.model.js';
import Booking from '../models/Booking.model.js';
import { sendPasswordChangedByAdminEmail } from '../services/email.service.js';

const router = express.Router();

// Simple admin authentication middleware
const adminAuth = (req, res, next) => {
  const adminPassword = req.headers['x-admin-password'];
  const ADMIN_PASSWORD = '7013367409';

  if (adminPassword === ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401).json({ 
      status: 'error', 
      message: 'Unauthorized. Invalid admin credentials.' 
    });
  }
};

// Get all users (admin only) - includes password for admin view
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find()
      .select('+password -refreshToken -passwordResetToken -emailVerificationToken')
      .sort({ createdAt: -1 });

    // Get booking count for each user
    const usersWithBookingCount = await Promise.all(
      users.map(async (user) => {
        const bookingCount = await Booking.countDocuments({ user: user._id });
        return {
          ...user.toObject(),
          bookingCount
        };
      })
    );

    res.json({
      status: 'success',
      data: {
        users: usersWithBookingCount,
        count: usersWithBookingCount.length
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch users'
    });
  }
});

// Get all bookings (admin only)
router.get('/bookings', adminAuth, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'username email mobile')
      .sort({ createdAt: -1 });

    res.json({
      status: 'success',
      data: {
        bookings,
        count: bookings.length
      }
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch bookings'
    });
  }
});

// Get admin statistics
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    // Calculate total revenue
    const bookings = await Booking.find({ status: { $in: ['confirmed', 'completed'] } });
    const totalRevenue = bookings.reduce((sum, booking) => {
      return sum + (booking.pricing?.totalPrice || booking.totalPrice || 0);
    }, 0);

    res.json({
      status: 'success',
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: totalUsers - activeUsers
        },
        bookings: {
          total: totalBookings,
          confirmed: confirmedBookings,
          cancelled: cancelledBookings
        },
        revenue: {
          total: totalRevenue,
          average: totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch statistics'
    });
  }
});

// Get user by ID (admin only)
router.get('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -refreshToken -passwordResetToken -emailVerificationToken');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Get user's bookings
    const bookings = await Booking.find({ user: req.params.id });

    res.json({
      status: 'success',
      data: {
        user,
        bookings,
        bookingCount: bookings.length
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user details'
    });
  }
});

// Update user status (admin only)
router.patch('/users/:id/status', adminAuth, async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.json({
      status: 'success',
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user }
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update user status'
    });
  }
});

// Change user password (admin only)
router.put('/users/:id/change-password', adminAuth, async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'Password must be at least 6 characters long'
      });
    }

    // Find user and include password field
    const user = await User.findById(req.params.id).select('+password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    // Send email notification to user
    try {
      await sendPasswordChangedByAdminEmail(user, newPassword);
      console.log('✅ Password changed email sent to user');
    } catch (emailError) {
      console.error('❌ Failed to send password changed email:', emailError);
      // Continue even if email fails
    }

    res.json({
      status: 'success',
      message: 'Password changed successfully. User has been notified via email.',
      data: {
        userId: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error changing user password:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to change user password'
    });
  }
});

export default router;
