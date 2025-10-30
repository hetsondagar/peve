"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const badge_controller_1 = require("../controllers/badge.controller");
const router = (0, express_1.Router)();
const UserBadge_1 = require("../models/UserBadge");
// Public routes
router.get('/all', badge_controller_1.getAllBadges);
// Public: Get badges for a specific user by ID (dist hotfix)
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ success: false, error: 'User ID is required' });
        }
        const badges = await UserBadge_1.UserBadge.find({ userId }).populate('badgeId').sort({ earnedAt: -1 });
        return res.json({ success: true, data: badges });
    }
    catch (error) {
        console.error('Error fetching public user badges:', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch user badges' });
    }
});
// Protected routes
router.get('/user', auth_1.requireAuth, badge_controller_1.getUserBadges);
router.put('/:badgeId/display', auth_1.requireAuth, badge_controller_1.toggleBadgeDisplay);
router.get('/stats', auth_1.requireAuth, badge_controller_1.getBadgeStats);
router.post('/check/:userId', auth_1.requireAuth, badge_controller_1.checkUserBadges);
exports.default = router;
