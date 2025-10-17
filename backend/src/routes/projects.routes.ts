import { Router } from 'express';
import { 
  createProject, 
  forkProject, 
  getProject, 
  listProjects, 
  recalcHealth, 
  updateProject,
  getTrendingProjects,
  likeProject,
  bookmarkProject,
  shareProject,
  requestCollaboration
} from '../controllers/projects.controller';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.get('/', listProjects);
router.get('/trending', getTrendingProjects);
router.get('/:id', getProject);
router.post('/', requireAuth, createProject);
router.put('/:id', requireAuth, updateProject);
router.post('/:id/health', requireAuth, recalcHealth);
router.post('/:id/fork', requireAuth, forkProject);
router.post('/:projectId/like', requireAuth, likeProject);
router.post('/:projectId/bookmark', requireAuth, bookmarkProject);
router.post('/:projectId/share', shareProject);
router.post('/:projectId/collaborate', requireAuth, requestCollaboration);

export default router;


