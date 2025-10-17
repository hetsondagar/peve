"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploads_controller_1 = require("../controllers/uploads.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/', auth_1.requireAuth, uploads_controller_1.uploadFile);
exports.default = router;
