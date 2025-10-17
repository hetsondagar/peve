"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const router = (0, express_1.Router)();
router.get('/stats', auth_1.requireAuth, dashboard_controller_1.getDashboardStats);
router.get('/activity', auth_1.requireAuth, dashboard_controller_1.getUserActivity);
exports.default = router;
