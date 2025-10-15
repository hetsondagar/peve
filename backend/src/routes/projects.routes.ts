import { Router } from 'express';
import { createProject, forkProject, getProject, listProjects, recalcHealth, updateProject } from '../controllers/projects.controller';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.get('/', listProjects);
router.get('/:id', getProject);
router.post('/', requireAuth, createProject);
router.put('/:id', requireAuth, updateProject);
router.post('/:id/health', requireAuth, recalcHealth);
router.post('/:id/fork', requireAuth, forkProject);

export default router;


