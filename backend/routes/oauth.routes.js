import express from 'express';
import passport from '../config/passport.config.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

const router = express.Router();

// Generate JWT token for OAuth users
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email,
      provider: user.provider 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email 
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
  );
};

// ==================== GOOGLE OAUTH ====================

// Initiate Google OAuth
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
  })
);

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`
  }),
  (req, res) => {
    try {
      const token = generateToken(req.user);
      const refreshToken = generateRefreshToken(req.user);

      // Redirect to frontend with tokens
      const redirectUrl = `${process.env.FRONTEND_URL}/oauth-callback?token=${token}&refreshToken=${refreshToken}&provider=google`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Google callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=token_generation_failed`);
    }
  }
);

// ==================== MICROSOFT OAUTH ====================

// Initiate Microsoft OAuth
router.get('/microsoft',
  passport.authenticate('microsoft', {
    scope: ['user.read'],
    session: false
  })
);

// Microsoft OAuth callback
router.get('/microsoft/callback',
  passport.authenticate('microsoft', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=microsoft_auth_failed`
  }),
  (req, res) => {
    try {
      const token = generateToken(req.user);
      const refreshToken = generateRefreshToken(req.user);

      // Redirect to frontend with tokens
      const redirectUrl = `${process.env.FRONTEND_URL}/oauth-callback?token=${token}&refreshToken=${refreshToken}&provider=microsoft`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Microsoft callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=token_generation_failed`);
    }
  }
);

// ==================== GET USER INFO ====================

// Get user info after OAuth (protected route)
router.get('/user', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'User not found' 
      });
    }

    res.json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ 
      status: 'error', 
      message: 'Invalid token' 
    });
  }
});

export default router;
