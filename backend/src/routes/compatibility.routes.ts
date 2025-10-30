import { Router } from 'express';
import { 
  getCompatibilityProfile,
  getCompatibilityProfileByUser,
  setupCompatibilityProfile,
  updateCompatibilityProfile,
  checkCompatibility,
  getSkillSuggestions,
  getCompatibilityOptions
} from '../controllers/compatibility.controller';
import { requireAuth } from '../middlewares/auth';

const router = Router();

// Get user's compatibility profile
router.get('/profile', requireAuth, getCompatibilityProfile);

// Public: Get compatibility profile by userId
router.get('/profile/:userId', getCompatibilityProfileByUser);

// Setup initial compatibility profile
router.post('/setup', requireAuth, setupCompatibilityProfile);

// Update compatibility profile (partial update)
router.patch('/profile', requireAuth, updateCompatibilityProfile);

// Check compatibility between two users
router.post('/check', requireAuth, checkCompatibility);

// Get skill suggestions for autocomplete
router.get('/skills/suggestions', getSkillSuggestions);

// Get all available options for form fields
router.get('/options', getCompatibilityOptions);

export default router;
