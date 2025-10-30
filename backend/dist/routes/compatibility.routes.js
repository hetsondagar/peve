"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const compatibility_controller_1 = require("../controllers/compatibility.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
const User_1 = require("../models/User");
// Get user's compatibility profile
router.get('/profile', auth_1.requireAuth, compatibility_controller_1.getCompatibilityProfile);
// Public: Get compatibility profile by userId (dist hotfix)
router.get('/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ success: false, error: 'User ID is required' });
        }
        const user = await User_1.User.findById(userId).select('compatibilitySetupComplete compatibilityProfile');
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        return res.json({
            success: true,
            data: {
                compatibilitySetupComplete: user.compatibilitySetupComplete,
                compatibilityProfile: user.compatibilityProfile
            }
        });
    }
    catch (error) {
        console.error('Get compatibility profile by user error:', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch compatibility profile' });
    }
});
// Setup initial compatibility profile
router.post('/setup', auth_1.requireAuth, compatibility_controller_1.setupCompatibilityProfile);
// Update compatibility profile (partial update)
router.patch('/profile', auth_1.requireAuth, compatibility_controller_1.updateCompatibilityProfile);
// Check compatibility between two users
router.post('/check', auth_1.requireAuth, compatibility_controller_1.checkCompatibility);
// Get skill suggestions for autocomplete
router.get('/skills/suggestions', compatibility_controller_1.getSkillSuggestions);
// Get all available options for form fields
router.get('/options', compatibility_controller_1.getCompatibilityOptions);
exports.default = router;
