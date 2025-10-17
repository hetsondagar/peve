import { Router } from 'express';
import { 
  compatibility, 
  createIdea, 
  getIdea, 
  joinIdea, 
  likeIdea, 
  listIdeas, 
  respondJoin,
  getTrendingIdeas,
  bookmarkIdea,
  getIdeaWithComments
} from '../controllers/ideas.controller';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.get('/', listIdeas);
router.get('/trending', getTrendingIdeas);
router.get('/:id', getIdea);
router.get('/:id/detailed', getIdeaWithComments);
router.post('/', requireAuth, createIdea);
router.post('/:id/join', requireAuth, joinIdea);
router.post('/:id/join/:requestId/respond', requireAuth, respondJoin);
router.post('/:id/like', requireAuth, likeIdea);
router.post('/:ideaId/bookmark', requireAuth, bookmarkIdea);
router.get('/:id/compatibility', compatibility);

export default router;


