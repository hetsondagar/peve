"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notifications_controller_1 = require("../controllers/notifications.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.requireAuth, notifications_controller_1.listNotifications);
router.post('/mark-read', auth_1.requireAuth, notifications_controller_1.markRead);
exports.default = router;
