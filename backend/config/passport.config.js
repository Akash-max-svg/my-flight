import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import User from '../models/User.model.js';
import dotenv from 'dotenv';

dotenv.config();

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && 
    process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id_here' &&
    process.env.GOOGLE_CLIENT_SECRET && 
    process.env.GOOGLE_CLIENT_SECRET !== 'your_google_client_secret_here') {
  
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
        scope: ['profile', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log('🔵 Google OAuth - Profile received:', {
            id: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName
          });

          // Check if user already exists
          let user = await User.findOne({ 
            $or: [
              { googleId: profile.id },
              { email: profile.emails?.[0]?.value }
            ]
          });

          if (user) {
            // Update existing user with Google info if not already set
            if (!user.googleId) {
              user.googleId = profile.id;
              user.provider = 'google';
              await user.save();
            }
            console.log('✅ Existing user logged in via Google:', user.email);
            return done(null, user);
          }

          // Create new user from Google profile
          const newUser = await User.create({
            googleId: profile.id,
            username: profile.displayName || profile.emails?.[0]?.value.split('@')[0],
            email: profile.emails?.[0]?.value,
            password: 'OAUTH_USER_' + Math.random().toString(36).substring(7), // Random password for OAuth users
            provider: 'google',
            profilePicture: profile.photos?.[0]?.value,
            isEmailVerified: true, // Google emails are verified
            age: 25, // Default values
            gender: 'prefer-not-to-say',
            mobile: '0000000000',
            country: 'Not specified',
            dob: new Date('2000-01-01')
          });

          console.log('✅ New user created via Google:', newUser.email);
          done(null, newUser);
        } catch (error) {
          console.error('❌ Google OAuth error:', error);
          done(error, null);
        }
      }
    )
  );
  console.log('✅ Google OAuth strategy configured');
} else {
  console.log('⚠️ Google OAuth not configured - credentials missing in .env');
}

// Microsoft OAuth Strategy
if (process.env.MICROSOFT_CLIENT_ID && 
    process.env.MICROSOFT_CLIENT_ID !== 'your_microsoft_client_id_here' &&
    process.env.MICROSOFT_CLIENT_SECRET && 
    process.env.MICROSOFT_CLIENT_SECRET !== 'your_microsoft_client_secret_here') {
  
  passport.use(
    new MicrosoftStrategy(
      {
        clientID: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        callbackURL: process.env.MICROSOFT_CALLBACK_URL || 'http://localhost:5000/api/auth/microsoft/callback',
        scope: ['user.read']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log('🔷 Microsoft OAuth - Profile received:', {
            id: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName
          });

          // Check if user already exists
          let user = await User.findOne({ 
            $or: [
              { microsoftId: profile.id },
              { email: profile.emails?.[0]?.value }
            ]
          });

          if (user) {
            // Update existing user with Microsoft info if not already set
            if (!user.microsoftId) {
              user.microsoftId = profile.id;
              user.provider = 'microsoft';
              await user.save();
            }
            console.log('✅ Existing user logged in via Microsoft:', user.email);
            return done(null, user);
          }

          // Create new user from Microsoft profile
          const newUser = await User.create({
            microsoftId: profile.id,
            username: profile.displayName || profile.emails?.[0]?.value.split('@')[0],
            email: profile.emails?.[0]?.value,
            password: 'OAUTH_USER_' + Math.random().toString(36).substring(7),
            provider: 'microsoft',
            profilePicture: profile.photos?.[0]?.value,
            isEmailVerified: true,
            age: 25,
            gender: 'prefer-not-to-say',
            mobile: '0000000000',
            country: 'Not specified',
            dob: new Date('2000-01-01')
          });

          console.log('✅ New user created via Microsoft:', newUser.email);
          done(null, newUser);
        } catch (error) {
          console.error('❌ Microsoft OAuth error:', error);
          done(error, null);
        }
      }
    )
  );
  console.log('✅ Microsoft OAuth strategy configured');
} else {
  console.log('⚠️ Microsoft OAuth not configured - credentials missing in .env');
}

export default passport;
