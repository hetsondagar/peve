import { Router } from 'express';
import { listNotifications, markRead } from '../controllers/notifications.controller';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.get('/', requireAuth, listNotifications);
router.post('/mark-read', requireAuth, markRead);

export default router;


