"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
// Get user by ID (public endpoint)
router.get('/:id', user_controller_1.getUserById);
// Get users with search and pagination (public endpoint)
router.get('/', user_controller_1.getUsers);
exports.default = router;
const router = (0, express_1.Router)();
// Get user by ID (public endpoint)
router.get('/:id', user_controller_1.getUserById);
// Get users with search and pagination (public endpoint)
router.get('/', user_controller_1.getUsers);
exports.default = router;
