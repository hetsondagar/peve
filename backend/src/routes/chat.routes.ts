import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import {
  getChatMessages,
  sendMessage,
  getCollabRooms,
  getCollabRoom,
  pinMessage
} from '../controllers/chat.controller';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Get collaboration rooms for user
router.get('/rooms', getCollabRooms);

// Get specific collaboration room
router.get('/rooms/:roomId', getCollabRoom);

// Get chat messages for a room
router.get('/rooms/:roomId/messages', getChatMessages);

// Send message to a room
router.post('/rooms/:roomId/messages', sendMessage);

// Pin/unpin a message
router.patch('/rooms/:roomId/messages/:messageId/pin', pinMessage);

export default router;
