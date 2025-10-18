"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const collaboration_controller_1 = require("../controllers/collaboration.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Check compatibility between two users
router.post('/compatibility/check', auth_1.requireAuth, collaboration_controller_1.checkCompatibility);
// Create collaboration request
router.post('/collab-request', auth_1.requireAuth, collaboration_controller_1.createCollaborationRequest);
// Accept collaboration request
router.patch('/requests/:requestId/accept', auth_1.requireAuth, collaboration_controller_1.acceptCollaborationRequest);
// Reject collaboration request
router.patch('/requests/:requestId/reject', auth_1.requireAuth, collaboration_controller_1.rejectCollaborationRequest);
// Get user's collaboration requests
router.get('/my-requests', auth_1.requireAuth, collaboration_controller_1.getMyRequests);
// Get user's notifications
router.get('/notifications', auth_1.requireAuth, collaboration_controller_1.getNotifications);
// Mark notification as seen
router.patch('/notifications/:notificationId/seen', auth_1.requireAuth, collaboration_controller_1.markNotificationSeen);
// Mark all notifications as seen
router.patch('/notifications/seen-all', auth_1.requireAuth, collaboration_controller_1.markAllNotificationsSeen);
exports.default = router;
