import { Router, Request, Response } from 'express';
import { requireAuth } from '../middlewares/auth';
import { getCurrentUser, updateProfile, getUserById, searchUsers, validateUsernames, testUserModel, simpleUsernameSearch } from '../controllers/users.controller';

const router = Router();

// Get current user profile
router.get('/me', requireAuth, getCurrentUser);

// Update current user profile
router.put('/profile', requireAuth, updateProfile);

// Test endpoint for debugging
router.get('/test-model', testUserModel);

// Test username search endpoint
router.get('/test-search', async (req: Request, res: Response) => {
  try {
    console.log('Test search endpoint called');
    return res.json({ success: true, message: 'Test endpoint working', query: req.query });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Test failed' });
  }
});

// Search usernames for autocomplete (public) - using simple search
router.get('/search-usernames', simpleUsernameSearch);

// Search users (public)
router.get('/', searchUsers);

// Get user by ID (public) - must be after other specific routes
router.get('/:userId', getUserById);

// Validate usernames (public)
router.post('/validate', validateUsernames);

export default router;