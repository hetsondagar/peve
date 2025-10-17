import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import {
  createComment,
  getComments,
  getCommentReplies,
  updateComment,
  deleteComment,
  toggleLikeComment
} from '../controllers/comments.controller';

const router = Router();

// Comment CRUD routes
router.post('/', requireAuth, createComment);
router.get('/:commentId/replies', getCommentReplies);
router.get('/:targetType/:targetId', getComments);
router.put('/:commentId', requireAuth, updateComment);
router.delete('/:commentId', requireAuth, deleteComment);

// Like comment
router.post('/:commentId/like', requireAuth, toggleLikeComment);

export default router;