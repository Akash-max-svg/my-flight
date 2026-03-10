import express from 'express';
import {
  adminLogin,
  validateSession,
  adminLogout,
  getAdminInfo,
  getLoginHistory,
  getActiveSessions
} from '../controllers/admin-auth.controller.js';

const router = express.Router();

// Admin authentication routes
router.post('/login', adminLogin);
router.post('/validate-session', validateSession);
router.post('/logout', adminLogout);
router.get('/me', getAdminInfo);
router.get('/login-history', getLoginHistory);
router.get('/sessions', getActiveSessions);

export default router;
