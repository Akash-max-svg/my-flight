import User from '../models/User.model.js';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail } from '../services/email.service.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// Generate Refresh Token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: '90d',
  });
};

// @desc    Register new user
// @route   POST /api/user-auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { username, email, password, age, gender, mobile, country, dob } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide username, email, and password',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        status: 'error',
        message: 'User with this email already exists',
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      age,
      gender,
      mobile,
      country,
      dob,
      provider: 'local',
      isActive: true,
    });

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Send welcome email
    try {
      await sendWelcomeEmail(user);
    } catch (emailError) {
      console.error('Welcome email failed:', emailError);
      // Don't fail registration if email fails
    }

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          age: user.age,
          gender: user.gender,
          mobile: user.mobile,
          country: user.country,
          dob: user.dob,
          provider: user.provider,
          isActive: user.isActive,
        },
        token,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Registration failed',
    });
  }
};

// @desc    Login user
// @route   POST /api/user-auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password',
      });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        status: 'error',
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          age: user.age,
          gender: user.gender,
          mobile: user.mobile,
          country: user.country,
          dob: user.dob,
          provider: user.provider,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
        },
        token,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Login failed',
    });
  }
};

// @desc    Get current user
// @route   GET /api/user-auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    res.json({
      status: 'success',
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          age: user.age,
          gender: user.gender,
          mobile: user.mobile,
          country: user.country,
          dob: user.dob,
          provider: user.provider,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to get user',
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/user-auth/update
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { username, age, gender, mobile, country, dob } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    // Update fields
    if (username) user.username = username;
    if (age) user.age = age;
    if (gender) user.gender = gender;
    if (mobile) user.mobile = mobile;
    if (country) user.country = country;
    if (dob) user.dob = dob;

    await user.save();

    res.json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          age: user.age,
          gender: user.gender,
          mobile: user.mobile,
          country: user.country,
          dob: user.dob,
          provider: user.provider,
          isActive: user.isActive,
        },
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to update profile',
    });
  }
};

// @desc    Logout user
// @route   POST /api/user-auth/logout
// @access  Private
export const logout = async (req, res) => {
  try {
    res.json({
      status: 'success',
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Logout failed',
    });
  }
};
