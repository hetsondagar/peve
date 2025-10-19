"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const users_controller_1 = require("../controllers/users.controller");
const router = (0, express_1.Router)();
// Get current user profile
router.get('/me', auth_1.requireAuth, users_controller_1.getCurrentUser);
// Update current user profile
router.put('/profile', auth_1.requireAuth, users_controller_1.updateProfile);
// Get user by ID (public)
router.get('/:userId', users_controller_1.getUserById);
// Search users (public)
router.get('/', users_controller_1.searchUsers);
// Search usernames for autocomplete (public)
router.get('/search-usernames', users_controller_1.searchUsernames);
// Validate usernames (public)
router.post('/validate', users_controller_1.validateUsernames);
exports.default = router;
