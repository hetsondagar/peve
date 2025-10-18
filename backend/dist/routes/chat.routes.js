"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const chat_controller_1 = require("../controllers/chat.controller");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.requireAuth);
// Get collaboration rooms for user
router.get('/rooms', chat_controller_1.getCollabRooms);
// Get specific collaboration room
router.get('/rooms/:roomId', chat_controller_1.getCollabRoom);
// Get chat messages for a room
router.get('/rooms/:roomId/messages', chat_controller_1.getChatMessages);
// Send message to a room
router.post('/rooms/:roomId/messages', chat_controller_1.sendMessage);
// Pin/unpin a message
router.patch('/rooms/:roomId/messages/:messageId/pin', chat_controller_1.pinMessage);
exports.default = router;
