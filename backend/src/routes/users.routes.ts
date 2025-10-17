import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import { getCurrentUser, updateProfile, getUserById, searchUsers } from '../controllers/users.controller';

const router = Router();

// Get current user profile
router.get('/me', requireAuth, getCurrentUser);

// Update current user profile
router.put('/profile', requireAuth, updateProfile);

// Get user by ID (public)
router.get('/:userId', getUserById);

// Search users (public)
router.get('/', searchUsers);

export default router;