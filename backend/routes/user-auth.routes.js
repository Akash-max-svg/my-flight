import express from 'express';
import { register, login, getMe, updateProfile, logout } from '../controllers/user-auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// User authentication routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/update', protect, updateProfile);
router.post('/logout', protect, logout);

export default router;
