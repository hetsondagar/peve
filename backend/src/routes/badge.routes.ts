import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import {
  getAllBadges,
  getUserBadges,
  toggleBadgeDisplay,
  getBadgeStats,
  checkUserBadges
} from '../controllers/badge.controller';

const router = Router();

// Public routes
router.get('/all', getAllBadges);

// Protected routes
router.get('/user', requireAuth, getUserBadges);
router.put('/:badgeId/display', requireAuth, toggleBadgeDisplay);
router.get('/stats', requireAuth, getBadgeStats);
router.post('/check/:userId', requireAuth, checkUserBadges);

export default router;
