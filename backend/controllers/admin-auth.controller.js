import Admin from '../models/Admin.model.js';

// @desc    Admin login
// @route   POST /api/admin-auth/login
// @access  Public
export const adminLogin = async (req, res) => {
  try {
    const { password } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Unknown';

    console.log('🔐 Admin login attempt:', { ipAddress, userAgent });

    if (!password) {
      return res.status(400).json({
        status: 'error',
        message: 'Password is required'
      });
    }

    // Find admin (there should be only one)
    const admin = await Admin.findOne({ username: 'admin' }).select('+password');

    if (!admin) {
      console.log('❌ Admin not found, creating default admin...');
      // Create default admin if doesn't exist
      const newAdmin = new Admin({
        username: 'admin',
        password: '7013367409',
        email: 'admin@flightbooking.com',
        role: 'superadmin',
        permissions: ['view_users', 'edit_users', 'delete_users', 'view_bookings', 'edit_bookings', 'delete_bookings', 'view_stats', 'manage_settings']
      });
      await newAdmin.save();
      
      return res.status(401).json({
        status: 'error',
        message: 'Admin created. Please try again.'
      });
    }

    // Verify password
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      console.log('❌ Invalid password');
      // Log failed attempt
      admin.loginHistory.push({
        ipAddress,
        userAgent,
        loginTime: new Date(),
        success: false
      });
      await admin.save();

      return res.status(401).json({
        status: 'error',
        message: 'Invalid password'
      });
    }

    console.log('✅ Password verified');

    // Clean expired sessions
    admin.cleanExpiredSessions();

    // Create new session
    const sessionToken = admin.createSession(ipAddress, userAgent);
    await admin.save();

    console.log('✅ Session created:', sessionToken.substring(0, 20) + '...');

    res.json({
      status: 'success',
      message: 'Login successful',
      data: {
        sessionToken,
        admin: {
          username: admin.username,
          email: admin.email,
          role: admin.role,
          permissions: admin.permissions
        }
      }
    });
  } catch (error) {
    console.error('❌ Admin login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during login'
    });
  }
};

// @desc    Validate admin session
// @route   POST /api/admin-auth/validate-session
// @access  Public
export const validateSession = async (req, res) => {
  try {
    const { sessionToken } = req.body;

    if (!sessionToken) {
      return res.status(400).json({
        status: 'error',
        message: 'Session token is required'
      });
    }

    const admin = await Admin.findOne({ 'sessions.sessionToken': sessionToken });

    if (!admin) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid session'
      });
    }

    const isValid = admin.validateSession(sessionToken);

    if (!isValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Session expired or invalid'
      });
    }

    await admin.save();

    res.json({
      status: 'success',
      message: 'Session is valid',
      data: {
        admin: {
          username: admin.username,
          email: admin.email,
          role: admin.role,
          permissions: admin.permissions
        }
      }
    });
  } catch (error) {
    console.error('Session validation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during validation'
    });
  }
};

// @desc    Admin logout
// @route   POST /api/admin-auth/logout
// @access  Private
export const adminLogout = async (req, res) => {
  try {
    const { sessionToken } = req.body;

    if (!sessionToken) {
      return res.status(400).json({
        status: 'error',
        message: 'Session token is required'
      });
    }

    const admin = await Admin.findOne({ 'sessions.sessionToken': sessionToken });

    if (!admin) {
      return res.status(404).json({
        status: 'error',
        message: 'Session not found'
      });
    }

    admin.logoutSession(sessionToken);
    await admin.save();

    res.json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during logout'
    });
  }
};

// @desc    Get admin info
// @route   GET /api/admin-auth/me
// @access  Private (requires session token)
export const getAdminInfo = async (req, res) => {
  try {
    const sessionToken = req.headers['x-admin-session'];

    if (!sessionToken) {
      return res.status(401).json({
        status: 'error',
        message: 'No session token provided'
      });
    }

    const admin = await Admin.findOne({ 'sessions.sessionToken': sessionToken });

    if (!admin || !admin.validateSession(sessionToken)) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired session'
      });
    }

    await admin.save();

    res.json({
      status: 'success',
      data: {
        admin: {
          username: admin.username,
          email: admin.email,
          role: admin.role,
          permissions: admin.permissions,
          lastLogin: admin.lastLogin,
          activeSessions: admin.sessions.filter(s => s.isActive && s.expiresAt > new Date()).length
        }
      }
    });
  } catch (error) {
    console.error('Get admin info error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Get admin login history
// @route   GET /api/admin-auth/login-history
// @access  Private (requires session token)
export const getLoginHistory = async (req, res) => {
  try {
    const sessionToken = req.headers['x-admin-session'];

    if (!sessionToken) {
      return res.status(401).json({
        status: 'error',
        message: 'No session token provided'
      });
    }

    const admin = await Admin.findOne({ 'sessions.sessionToken': sessionToken });

    if (!admin || !admin.validateSession(sessionToken)) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired session'
      });
    }

    await admin.save();

    res.json({
      status: 'success',
      data: {
        loginHistory: admin.loginHistory.slice(-50).reverse() // Last 50 logins
      }
    });
  } catch (error) {
    console.error('Get login history error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Get active admin sessions
// @route   GET /api/admin-auth/sessions
// @access  Private (requires session token)
export const getActiveSessions = async (req, res) => {
  try {
    const sessionToken = req.headers['x-admin-session'];

    if (!sessionToken) {
      return res.status(401).json({
        status: 'error',
        message: 'No session token provided'
      });
    }

    const admin = await Admin.findOne({ 'sessions.sessionToken': sessionToken });

    if (!admin || !admin.validateSession(sessionToken)) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired session'
      });
    }

    admin.cleanExpiredSessions();
    await admin.save();

    const activeSessions = admin.sessions
      .filter(s => s.isActive && s.expiresAt > new Date())
      .map(s => ({
        ipAddress: s.ipAddress,
        userAgent: s.userAgent,
        loginTime: s.loginTime,
        lastActivity: s.lastActivity,
        expiresAt: s.expiresAt,
        isCurrent: s.sessionToken === sessionToken
      }));

    res.json({
      status: 'success',
      data: {
        sessions: activeSessions
      }
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};
