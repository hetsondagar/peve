import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import { 
  toggleLike, 
  toggleSave, 
  getUserLikes, 
  getUserSaves, 
  getInteractionStatus 
} from '../controllers/interaction.controller';

const router = Router();

// Toggle like/unlike
router.post('/like/:targetType/:targetId', requireAuth, toggleLike);

// Toggle save/unsave
router.post('/save/:targetType/:targetId', requireAuth, toggleSave);

// Get user's liked items
router.get('/likes', requireAuth, getUserLikes);

// Get user's saved items
router.get('/saves', requireAuth, getUserSaves);

// Get interaction status for multiple items
router.post('/status', requireAuth, getInteractionStatus);

export default router;
