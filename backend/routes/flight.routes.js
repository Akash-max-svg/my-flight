import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', async (req, res) => {
  res.json({ status: 'success', message: 'Get all flights endpoint' });
});

router.get('/:id', async (req, res) => {
  res.json({ status: 'success', message: 'Get flight by ID endpoint' });
});

router.post('/search', async (req, res) => {
  res.json({ status: 'success', message: 'Search flights endpoint' });
});

router.get('/filter', async (req, res) => {
  res.json({ status: 'success', message: 'Filter flights endpoint' });
});

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  res.json({ status: 'success', message: 'Create flight endpoint' });
});

router.put('/:id', protect, authorize('admin'), async (req, res) => {
  res.json({ status: 'success', message: 'Update flight endpoint' });
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  res.json({ status: 'success', message: 'Delete flight endpoint' });
});

export default router;
