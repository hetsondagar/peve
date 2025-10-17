import { Router } from 'express';
import { 
  checkCompatibility,
  createCollaborationRequest,
  acceptCollaborationRequest,
  rejectCollaborationRequest,
  getMyRequests,
  getNotifications,
  markNotificationSeen,
  markAllNotificationsSeen
} from '../controllers/collaboration.controller';
import { requireAuth } from '../middlewares/auth';

const router = Router();

// Check compatibility between two users
router.post('/compatibility/check', requireAuth, checkCompatibility);

// Create collaboration request
router.post('/collab-request', requireAuth, createCollaborationRequest);

// Accept collaboration request
router.patch('/requests/:requestId/accept', requireAuth, acceptCollaborationRequest);

// Reject collaboration request
router.patch('/requests/:requestId/reject', requireAuth, rejectCollaborationRequest);

// Get user's collaboration requests
router.get('/my-requests', requireAuth, getMyRequests);

// Get user's notifications
router.get('/notifications', requireAuth, getNotifications);

// Mark notification as seen
router.patch('/notifications/:notificationId/seen', requireAuth, markNotificationSeen);

// Mark all notifications as seen
router.patch('/notifications/seen-all', requireAuth, markAllNotificationsSeen);

export default router;
