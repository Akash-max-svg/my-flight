import express from 'express';
import User from '../models/User.model.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.utils.js';

const router = express.Router();

// Quick login route - creates/logs in user instantly without OAuth
router.post('/quick-login', async (req, res) => {
  try {
    const { provider, name, email } = req.body;

    console.log(`🚀 Quick Login: ${provider} - ${email}`);

    // Validate input
    if (!provider || !name || !email) {
      return res.status(400).json({
        status: 'error',
        message: 'Provider, name, and email are required'
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // Update existing user with provider info
      const providerIdField = `${provider}Id`;
      if (!user[providerIdField]) {
        user[providerIdField] = `${provider}_quick_${Date.now()}`;
        user.provider = provider;
        await user.save();
      }
      console.log(`✅ Existing user logged in via ${provider}:`, user.email);
    } else {
      // Create new user
      const userData = {
        username: name,
        email: email,
        password: 'QUICK_LOGIN_' + Math.random().toString(36).substring(7),
        provider: provider,
        profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`,
        isEmailVerified: true,
        age: 25,
        gender: 'prefer-not-to-say',
        mobile: '0000000000',
        country: 'Not specified',
        dob: new Date('2000-01-01')
      };

      // Add provider-specific ID
      if (provider === 'google') {
        userData.googleId = `google_quick_${Date.now()}`;
      } else if (provider === 'microsoft') {
        userData.microsoftId = `microsoft_quick_${Date.now()}`;
      } else if (provider === 'instagram') {
        userData.instagramId = `instagram_quick_${Date.now()}`;
      }

      user = await User.create(userData);
      console.log(`✅ New user created via ${provider}:`, user.email);
    }

    // Generate JWT tokens
    const token = generateAccessToken({ userId: user._id });
    const refreshToken = generateRefreshToken({ userId: user._id });

    // Return user data and tokens
    res.status(200).json({
      status: 'success',
      message: `Logged in successfully with ${provider}`,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          provider: user.provider,
          profilePicture: user.profilePicture,
          isEmailVerified: user.isEmailVerified
        },
        token,
        refreshToken
      }
    });

  } catch (error) {
    console.error('❌ Quick login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Login failed. Please try again.',
      error: error.message
    });
  }
});

export default router;
