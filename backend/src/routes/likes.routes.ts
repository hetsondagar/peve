import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import {
  toggleLikeIdea,
  toggleLikeProject,
  getLikedByUsers
} from '../controllers/likes.controller';

const router = Router();

// Like/Unlike routes
router.post('/idea/:ideaId', requireAuth, toggleLikeIdea);
router.post('/project/:projectId', requireAuth, toggleLikeProject);

// Get users who liked
router.get('/:type/:id/users', getLikedByUsers);

export default router;
