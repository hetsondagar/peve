"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const comments_controller_1 = require("../controllers/comments.controller");
const router = (0, express_1.Router)();
// Comment CRUD routes
router.post('/', auth_1.requireAuth, comments_controller_1.createComment);
router.get('/replies/:commentId', comments_controller_1.getCommentReplies);
router.get('/:targetType/:targetId', comments_controller_1.getComments);
router.put('/:commentId', auth_1.requireAuth, comments_controller_1.updateComment);
router.delete('/:commentId', auth_1.requireAuth, comments_controller_1.deleteComment);
// Like comment
router.post('/:commentId/like', auth_1.requireAuth, comments_controller_1.toggleLikeComment);
exports.default = router;
