import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import { getCurrentUser, updateProfile, getUserById, searchUsers, validateUsernames, searchUsernames, testUserModel, simpleUsernameSearch } from '../controllers/users.controller';

const router = Router();

// Get current user profile
router.get('/me', requireAuth, getCurrentUser);

// Update current user profile
router.put('/profile', requireAuth, updateProfile);

// Test endpoint for debugging
router.get('/test-model', testUserModel);

// Search usernames for autocomplete (public) - using simple search
router.get('/search-usernames', simpleUsernameSearch);

// Search users (public)
router.get('/', searchUsers);

// Get user by ID (public) - must be after other specific routes
router.get('/:userId', getUserById);

// Validate usernames (public)
router.post('/validate', validateUsernames);

export default router;