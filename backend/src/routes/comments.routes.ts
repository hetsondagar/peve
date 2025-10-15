import { Router } from 'express';
import { createComment, deleteComment, listComments, updateComment } from '../controllers/comments.controller';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.get('/', listComments);
router.post('/', requireAuth, createComment);
router.put('/:id', requireAuth, updateComment);
router.delete('/:id', requireAuth, deleteComment);

export default router;


