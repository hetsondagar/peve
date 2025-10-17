"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const interaction_controller_1 = require("../controllers/interaction.controller");
const router = (0, express_1.Router)();
// Toggle like/unlike
router.post('/like/:targetType/:targetId', auth_1.requireAuth, interaction_controller_1.toggleLike);
// Toggle save/unsave
router.post('/save/:targetType/:targetId', auth_1.requireAuth, interaction_controller_1.toggleSave);
// Get user's liked items
router.get('/likes', auth_1.requireAuth, interaction_controller_1.getUserLikes);
// Get user's saved items
router.get('/saves', auth_1.requireAuth, interaction_controller_1.getUserSaves);
// Get interaction status for multiple items
router.post('/status', auth_1.requireAuth, interaction_controller_1.getInteractionStatus);
exports.default = router;
