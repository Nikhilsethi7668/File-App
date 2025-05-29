import express from 'express';
import { getDashboardData } from '../controller/dashboard.controller';

const router = express.Router();
// Get all 
router.get('/', getDashboardData);

export default router;