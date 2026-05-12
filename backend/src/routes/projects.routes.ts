import { Router } from 'express';
import rateLimit from 'express-rate-limit';
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
  getProjectsByContributor,
  analyzeGithubRepository,
  getRepositoryInsights
} from '../controllers/projects.controller';
import { requireAuth } from '../middlewares/auth';

const analyzeGithubLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
});

const repositoryInsightsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();

router.get('/', listProjects);
router.get('/trending', getTrendingProjects);
router.get('/contributor/:userId', getProjectsByContributor);
router.post('/analyze-github-repo', analyzeGithubLimiter, requireAuth, analyzeGithubRepository);
router.get('/:id/repository-insights', repositoryInsightsLimiter, getRepositoryInsights);
router.get('/:id', getProject);
router.post('/', requireAuth, createProject);
router.put('/:id', requireAuth, updateProject);
router.delete('/:id', requireAuth, deleteProject);
// Alias route to be robust against client variants
router.delete('/:projectId', requireAuth, deleteProject);
router.post('/:id/health', requireAuth, recalcHealth);
router.post('/:id/fork', requireAuth, forkProject);
router.post('/:projectId/like', requireAuth, likeProject);
router.post('/:projectId/bookmark', requireAuth, bookmarkProject);
router.post('/:projectId/share', shareProject);
router.post('/:projectId/collaborate', requireAuth, requestCollaboration);

export default router;


