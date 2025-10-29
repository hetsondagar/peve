import { Router } from 'express';
import { 
  createProject, 
  forkProject, 
  getProject, 
  listProjects, 
  recalcHealth, 
  updateProject,
  deleteProject,
  getTrendingProjects,
  likeProject,
  bookmarkProject,
  shareProject,
  requestCollaboration,
  getProjectsByContributor
} from '../controllers/projects.controller';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.get('/', listProjects);
router.get('/trending', getTrendingProjects);
router.get('/contributor/:userId', getProjectsByContributor);
router.get('/:id', getProject);
router.post('/', requireAuth, createProject);
router.put('/:id', requireAuth, updateProject);
router.delete('/:id', requireAuth, deleteProject);
router.post('/:id/health', requireAuth, recalcHealth);
router.post('/:id/fork', requireAuth, forkProject);
router.post('/:projectId/like', requireAuth, likeProject);
router.post('/:projectId/bookmark', requireAuth, bookmarkProject);
router.post('/:projectId/share', shareProject);
router.post('/:projectId/collaborate', requireAuth, requestCollaboration);

export default router;


