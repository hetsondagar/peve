import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import {
  getDashboardStats,
  getUserActivity
} from '../controllers/dashboard.controller';

const router = Router();

router.get('/stats', requireAuth, getDashboardStats);
router.get('/activity', requireAuth, getUserActivity);

export default router;
