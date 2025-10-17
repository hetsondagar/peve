"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const compatibility_controller_1 = require("../controllers/compatibility.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Get user's compatibility profile
router.get('/profile', auth_1.requireAuth, compatibility_controller_1.getCompatibilityProfile);
// Setup initial compatibility profile
router.post('/setup', auth_1.requireAuth, compatibility_controller_1.setupCompatibilityProfile);
// Update compatibility profile (partial update)
router.patch('/profile', auth_1.requireAuth, compatibility_controller_1.updateCompatibilityProfile);
// Check compatibility between two users
router.post('/check', auth_1.requireAuth, compatibility_controller_1.checkCompatibility);
// Get skill suggestions for autocomplete
router.get('/skills/suggestions', compatibility_controller_1.getSkillSuggestions);
// Get all available options for form fields
router.get('/options', compatibility_controller_1.getCompatibilityOptions);
exports.default = router;
