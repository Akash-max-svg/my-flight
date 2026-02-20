import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all users (admin only)
router.get('/', authorize('admin'), async (req, res) => {
  res.json({ status: 'success', message: 'Get all users endpoint' });
});

// Get user by ID
router.get('/:id', async (req, res) => {
  res.json({ status: 'success', message: 'Get user by ID endpoint' });
});

// Update user
router.put('/:id', async (req, res) => {
  res.json({ status: 'success', message: 'Update user endpoint' });
});

// Delete user (admin only)
router.delete('/:id', authorize('admin'), async (req, res) => {
  res.json({ status: 'success', message: 'Delete user endpoint' });
});

export default router;
