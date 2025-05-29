import express from 'express';
import { getDashboardData } from '../controller/dashboard.controller.js';
import { protectRoute, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get dashboard data - admin only
router.get('/', protectRoute, isAdmin, getDashboardData);

export default router;