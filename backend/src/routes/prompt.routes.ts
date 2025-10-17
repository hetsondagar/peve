import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import { 
  getTodaysPrompt, 
  voteOnPrompt, 
  getAllPrompts, 
  createPrompt 
} from '../controllers/prompt.controller';

const router = Router();

// Get today's prompt (public)
router.get('/today', getTodaysPrompt);

// Get all prompts (public)
router.get('/', getAllPrompts);

// Vote on a prompt (authenticated)
router.post('/:promptId/vote', requireAuth, voteOnPrompt);

// Create a new prompt (authenticated - could be admin only later)
router.post('/', requireAuth, createPrompt);

export default router;
