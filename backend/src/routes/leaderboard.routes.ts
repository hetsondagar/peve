import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import {
  getLeaderboard,
  getUserRank,
  getBadges,
  getAllBadges
} from '../controllers/leaderboard.controller';

const router = Router();

router.get('/', getLeaderboard);
router.get('/rank', requireAuth, getUserRank);
router.get('/badges', requireAuth, getBadges);
router.get('/badges/all', getAllBadges);

export default router;
