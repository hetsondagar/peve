import { Router } from 'express';
import { searchAll, searchProjects, searchIdeas, searchUsers } from '../controllers/search.controller';

const router = Router();

// Search all content types
router.get('/', searchAll);

// Search specific content types
router.get('/projects', searchProjects);
router.get('/ideas', searchIdeas);
router.get('/users', searchUsers);

export default router;