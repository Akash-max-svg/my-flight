import express from 'express';
import crypto from 'crypto';
import User from '../models/User.model.js';
import UserSession from '../models/UserSession.model.js';
import UserPreferences from '../models/UserPreferences.model.js';

const router = express.Router();

// Helper function to generate session token
const generateSessionToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Helper function to generate refresh token
const generateRefreshToken = () => {
  return crypto.randomBytes(48).toString('hex');
};

// Helper function to get client info
const getClientInfo = (req) => {
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const ipAddress = req.ip || req.connection.remoteAddress || 'Unknown';
  
  return {
    ipAddress,
    userAgent,
    deviceInfo: {
      browser: userAgent.includes('Chrome') ? 'Chrome' : 
               userAgent.includes('Firefox') ? 'Firefox' :
               userAgent.includes('Safari') ? 'Safari' : 'Other',
      os: userAgent.includes('Windows') ? 'Windows' :
          userAgent.includes('Mac') ? 'MacOS' :
          userAgent.includes('Linux') ? 'Linux' : 'Other',
      device: userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'
    }
  };
};

// ==================== USER LOGIN ====================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required'
      });
    }

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        status: 'error',
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Generate session tokens
    const sessionToken = generateSessionToken();
    const refreshToken = generateRefreshToken();
    const clientInfo = getClientInfo(req);

    // Create session in database
    const session = await UserSession.create({
      user: user._id,
      sessionToken,
      refreshToken,
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent,
      deviceInfo: clientInfo.deviceInfo,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    // Update user last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Get or create user preferences
    let preferences = await UserPreferences.findOne({ user: user._id });
    if (!preferences) {
      preferences = await UserPreferences.create({ user: user._id });
    }

    // Return user data with session token
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          mobile: user.mobile,
          age: user.age,
          gender: user.gender,
          country: user.country,
          dob: user.dob,
          role: user.role,
          profileImage: user.profileImage,
          profilePicture: user.profilePicture,
          provider: user.provider,
          loyaltyPoints: user.loyaltyPoints,
          totalBookings: user.totalBookings,
          totalSpent: user.totalSpent,
          lastLogin: user.lastLogin
        },
        sessionToken,
        refreshToken,
        expiresAt: session.expiresAt,
        preferences
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Login failed',
      error: error.message
    });
  }
});

// ==================== USER REGISTER ====================
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, age, gender, mobile, country, dob } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
      });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      age,
      gender,
      mobile,
      country,
      dob: dob ? new Date(dob) : null,
      provider: 'local'
    });

    // Generate session tokens
    const sessionToken = generateSessionToken();
    const refreshToken = generateRefreshToken();
    const clientInfo = getClientInfo(req);

    // Create session
    const session = await UserSession.create({
      user: user._id,
      sessionToken,
      refreshToken,
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent,
      deviceInfo: clientInfo.deviceInfo,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    // Create user preferences
    const preferences = await UserPreferences.create({ user: user._id });

    // Return user data with session token
    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          mobile: user.mobile,
          age: user.age,
          gender: user.gender,
          country: user.country,
          dob: user.dob,
          role: user.role,
          profileImage: user.profileImage,
          loyaltyPoints: user.loyaltyPoints
        },
        sessionToken,
        refreshToken,
        expiresAt: session.expiresAt,
        preferences
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Registration failed',
      error: error.message
    });
  }
});

// ==================== VALIDATE SESSION ====================
router.post('/validate-session', async (req, res) => {
  try {
    const { sessionToken } = req.body;

    if (!sessionToken) {
      return res.status(400).json({
        status: 'error',
        message: 'Session token is required'
      });
    }

    // Find active session
    const session = await UserSession.findOne({
      sessionToken,
      isActive: true,
      expiresAt: { $gt: new Date() }
    }).populate('user');

    if (!session) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired session'
      });
    }

    // Update last activity
    await session.updateActivity();

    // Get user preferences
    const preferences = await UserPreferences.findOne({ user: session.user._id });

    res.status(200).json({
      status: 'success',
      message: 'Session is valid',
      data: {
        user: {
          id: session.user._id,
          username: session.user.username,
          email: session.user.email,
          mobile: session.user.mobile,
          age: session.user.age,
          gender: session.user.gender,
          country: session.user.country,
          dob: session.user.dob,
          role: session.user.role,
          profileImage: session.user.profileImage,
          profilePicture: session.user.profilePicture,
          provider: session.user.provider,
          loyaltyPoints: session.user.loyaltyPoints,
          totalBookings: session.user.totalBookings,
          totalSpent: session.user.totalSpent,
          lastLogin: session.user.lastLogin
        },
        sessionToken,
        expiresAt: session.expiresAt,
        preferences
      }
    });

  } catch (error) {
    console.error('Session validation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Session validation failed',
      error: error.message
    });
  }
});

// ==================== LOGOUT ====================
router.post('/logout', async (req, res) => {
  try {
    const { sessionToken } = req.body;

    if (!sessionToken) {
      return res.status(400).json({
        status: 'error',
        message: 'Session token is required'
      });
    }

    // Find and logout session
    const session = await UserSession.findOne({ sessionToken, isActive: true });

    if (session) {
      await session.logout('manual');
    }

    res.status(200).json({
      status: 'success',
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Logout failed',
      error: error.message
    });
  }
});

// ==================== GET USER PROFILE ====================
router.get('/me', async (req, res) => {
  try {
    const sessionToken = req.headers['x-session-token'];

    if (!sessionToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Session token is required'
      });
    }

    // Find active session
    const session = await UserSession.findOne({
      sessionToken,
      isActive: true,
      expiresAt: { $gt: new Date() }
    }).populate('user');

    if (!session) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired session'
      });
    }

    // Update last activity
    await session.updateActivity();

    // Get user preferences
    const preferences = await UserPreferences.findOne({ user: session.user._id });

    res.status(200).json({
      status: 'success',
      data: {
        user: session.user,
        preferences
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get profile',
      error: error.message
    });
  }
});

// ==================== UPDATE USER PROFILE ====================
router.put('/update-profile', async (req, res) => {
  try {
    const sessionToken = req.headers['x-session-token'];

    if (!sessionToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Session token is required'
      });
    }

    // Find active session
    const session = await UserSession.findOne({
      sessionToken,
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    if (!session) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired session'
      });
    }

    // Update user
    const allowedUpdates = ['username', 'mobile', 'age', 'gender', 'country', 'dob', 'profileImage'];
    const updates = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      session.user,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

// ==================== GET ACTIVE SESSIONS ====================
router.get('/sessions', async (req, res) => {
  try {
    const sessionToken = req.headers['x-session-token'];

    if (!sessionToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Session token is required'
      });
    }

    // Find active session
    const session = await UserSession.findOne({
      sessionToken,
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    if (!session) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired session'
      });
    }

    // Get all active sessions for user
    const sessions = await UserSession.getActiveSessions(session.user);

    res.status(200).json({
      status: 'success',
      data: { sessions }
    });

  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get sessions',
      error: error.message
    });
  }
});

// ==================== LOGOUT ALL SESSIONS ====================
router.post('/logout-all', async (req, res) => {
  try {
    const sessionToken = req.headers['x-session-token'];

    if (!sessionToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Session token is required'
      });
    }

    // Find active session
    const session = await UserSession.findOne({
      sessionToken,
      isActive: true
    });

    if (!session) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid session'
      });
    }

    // Logout all sessions for user
    await UserSession.logoutAllUserSessions(session.user, 'manual');

    res.status(200).json({
      status: 'success',
      message: 'All sessions logged out successfully'
    });

  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to logout all sessions',
      error: error.message
    });
  }
});

// ==================== UPDATE PREFERENCES ====================
router.put('/preferences', async (req, res) => {
  try {
    const sessionToken = req.headers['x-session-token'];

    if (!sessionToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Session token is required'
      });
    }

    // Find active session
    const session = await UserSession.findOne({
      sessionToken,
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    if (!session) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired session'
      });
    }

    // Update preferences
    const preferences = await UserPreferences.findOneAndUpdate(
      { user: session.user },
      req.body,
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      message: 'Preferences updated successfully',
      data: { preferences }
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update preferences',
      error: error.message
    });
  }
});

export default router;
