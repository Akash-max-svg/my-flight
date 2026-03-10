import express from 'express';
import User from '../models/User.model.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.utils.js';

const router = express.Router();

// Development mode OAuth simulation
// This allows testing OAuth functionality without real credentials

// Google OAuth - Development Mode
router.get('/google', (req, res) => {
  console.log('🔵 [DEV MODE] Google OAuth initiated');
  // Redirect to dev confirmation page
  res.redirect(`${process.env.FRONTEND_URL}/oauth-dev-confirm?provider=google`);
});

router.get('/google/callback', async (req, res) => {
  try {
    const { email, name } = req.query;
    
    console.log('🔵 [DEV MODE] Google OAuth callback:', { email, name });

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // Update existing user with Google info
      if (!user.googleId) {
        user.googleId = `google_dev_${Date.now()}`;
        user.provider = 'google';
        await user.save();
      }
      console.log('✅ [DEV MODE] Existing user logged in via Google:', user.email);
    } else {
      // Create new user
      user = await User.create({
        googleId: `google_dev_${Date.now()}`,
        username: name || email.split('@')[0],
        email: email,
        password: 'OAUTH_DEV_USER_' + Math.random().toString(36).substring(7),
        provider: 'google',
        profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email)}&background=4285F4&color=fff`,
        isEmailVerified: true,
        age: 25,
        gender: 'prefer-not-to-say',
        mobile: '0000000000',
        country: 'Not specified',
        dob: new Date('2000-01-01')
      });
      console.log('✅ [DEV MODE] New user created via Google:', user.email);
    }

    // Generate JWT token
    const token = generateAccessToken({ userId: user._id });
    const refreshToken = generateRefreshToken({ userId: user._id });

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?token=${token}&refreshToken=${refreshToken}`);
  } catch (error) {
    console.error('❌ [DEV MODE] Google OAuth error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
  }
});

// Microsoft OAuth - Development Mode
router.get('/microsoft', (req, res) => {
  console.log('🔷 [DEV MODE] Microsoft OAuth initiated');
  res.redirect(`${process.env.FRONTEND_URL}/oauth-dev-confirm?provider=microsoft`);
});

router.get('/microsoft/callback', async (req, res) => {
  try {
    const { email, name } = req.query;
    
    console.log('🔷 [DEV MODE] Microsoft OAuth callback:', { email, name });

    let user = await User.findOne({ email });

    if (user) {
      if (!user.microsoftId) {
        user.microsoftId = `microsoft_dev_${Date.now()}`;
        user.provider = 'microsoft';
        await user.save();
      }
      console.log('✅ [DEV MODE] Existing user logged in via Microsoft:', user.email);
    } else {
      user = await User.create({
        microsoftId: `microsoft_dev_${Date.now()}`,
        username: name || email.split('@')[0],
        email: email,
        password: 'OAUTH_DEV_USER_' + Math.random().toString(36).substring(7),
        provider: 'microsoft',
        profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email)}&background=00A4EF&color=fff`,
        isEmailVerified: true,
        age: 25,
        gender: 'prefer-not-to-say',
        mobile: '0000000000',
        country: 'Not specified',
        dob: new Date('2000-01-01')
      });
      console.log('✅ [DEV MODE] New user created via Microsoft:', user.email);
    }

    const token = generateAccessToken({ userId: user._id });
    const refreshToken = generateRefreshToken({ userId: user._id });

    res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?token=${token}&refreshToken=${refreshToken}`);
  } catch (error) {
    console.error('❌ [DEV MODE] Microsoft OAuth error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
  }
});

// Instagram OAuth - Development Mode
router.get('/instagram', (req, res) => {
  console.log('🌈 [DEV MODE] Instagram OAuth initiated');
  res.redirect(`${process.env.FRONTEND_URL}/oauth-dev-confirm?provider=instagram`);
});

router.get('/instagram/callback', async (req, res) => {
  try {
    const { email, name, username } = req.query;
    
    console.log('🌈 [DEV MODE] Instagram OAuth callback:', { email, name, username });

    let user = await User.findOne({ email });

    if (user) {
      if (!user.instagramId) {
        user.instagramId = `instagram_dev_${Date.now()}`;
        user.provider = 'instagram';
        await user.save();
      }
      console.log('✅ [DEV MODE] Existing user logged in via Instagram:', user.email);
    } else {
      user = await User.create({
        instagramId: `instagram_dev_${Date.now()}`,
        username: username || name || email.split('@')[0],
        email: email,
        password: 'OAUTH_DEV_USER_' + Math.random().toString(36).substring(7),
        provider: 'instagram',
        profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || username || email)}&background=E4405F&color=fff`,
        isEmailVerified: true,
        age: 25,
        gender: 'prefer-not-to-say',
        mobile: '0000000000',
        country: 'Not specified',
        dob: new Date('2000-01-01')
      });
      console.log('✅ [DEV MODE] New user created via Instagram:', user.email);
    }

    const token = generateAccessToken({ userId: user._id });
    const refreshToken = generateRefreshToken({ userId: user._id });

    res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?token=${token}&refreshToken=${refreshToken}`);
  } catch (error) {
    console.error('❌ [DEV MODE] Instagram OAuth error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
  }
});

export default router;
