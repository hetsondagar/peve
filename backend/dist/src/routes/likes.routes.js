"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const likes_controller_1 = require("../controllers/likes.controller");
const router = (0, express_1.Router)();
// Like/Unlike routes
router.post('/idea/:ideaId', auth_1.requireAuth, likes_controller_1.toggleLikeIdea);
router.post('/project/:projectId', auth_1.requireAuth, likes_controller_1.toggleLikeProject);
// Get users who liked
router.get('/:type/:id/users', likes_controller_1.getLikedByUsers);
exports.default = router;
