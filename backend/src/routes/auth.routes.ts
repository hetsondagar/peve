import { Router } from 'express';
import { login, logout, me, refresh, signup, updateProfile, completeOnboarding } from '../controllers/auth.controller';
import { completeProfile } from '../controllers/profile-completion.controller';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refresh);
router.get('/me', requireAuth, me);
router.post('/logout', requireAuth, logout);
router.put('/profile', requireAuth, updateProfile);
router.post('/onboarding', requireAuth, completeOnboarding);
router.post('/profile-completion', requireAuth, completeProfile);

export default router;



