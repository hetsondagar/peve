"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const collaborations_controller_1 = require("../controllers/collaborations.controller");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.requireAuth);
// Request collaboration on an idea
router.post('/request', collaborations_controller_1.requestCollaboration);
// Respond to collaboration request (accept/reject)
router.patch('/:collaborationId/respond', collaborations_controller_1.respondToCollaboration);
// Get collaboration requests for my ideas
router.get('/requests', collaborations_controller_1.getCollaborationRequests);
// Get my collaboration requests
router.get('/my-requests', collaborations_controller_1.getMyCollaborationRequests);
exports.default = router;
