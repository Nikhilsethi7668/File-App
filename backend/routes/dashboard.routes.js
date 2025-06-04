import express from 'express';
import { getDashboardData } from '../controller/dashboard.controller.js';
import { protectRoute} from '../middleware/auth.middleware.js';

const router = express.Router();

// Get dashboard data - admin only
router.get('/',protectRoute,  getDashboardData);

export default router;