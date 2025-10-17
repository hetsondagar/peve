import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import {
  requestCollaboration,
  respondToCollaboration,
  getCollaborationRequests,
  getMyCollaborationRequests
} from '../controllers/collaborations.controller';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Request collaboration on an idea
router.post('/request', requestCollaboration);

// Respond to collaboration request (accept/reject)
router.patch('/:collaborationId/respond', respondToCollaboration);

// Get collaboration requests for my ideas
router.get('/requests', getCollaborationRequests);

// Get my collaboration requests
router.get('/my-requests', getMyCollaborationRequests);

export default router;
