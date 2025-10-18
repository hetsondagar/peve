"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const badge_controller_1 = require("../controllers/badge.controller");
const router = (0, express_1.Router)();
// Public routes
router.get('/all', badge_controller_1.getAllBadges);
// Protected routes
router.get('/user', auth_1.requireAuth, badge_controller_1.getUserBadges);
router.put('/:badgeId/display', auth_1.requireAuth, badge_controller_1.toggleBadgeDisplay);
router.get('/stats', auth_1.requireAuth, badge_controller_1.getBadgeStats);
router.post('/check/:userId', auth_1.requireAuth, badge_controller_1.checkUserBadges);
exports.default = router;
