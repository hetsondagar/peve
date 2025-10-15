import { Router } from 'express';
import { login, logout, me, refresh, signup } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refresh);
router.get('/me', requireAuth, me);
router.post('/logout', requireAuth, logout);

export default router;


