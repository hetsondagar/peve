"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const prompt_controller_1 = require("../controllers/prompt.controller");
const router = (0, express_1.Router)();
// Get today's prompt (public)
router.get('/today', prompt_controller_1.getTodaysPrompt);
// Get all prompts (public)
router.get('/', prompt_controller_1.getAllPrompts);
// Vote on a prompt (authenticated)
router.post('/:promptId/vote', auth_1.requireAuth, prompt_controller_1.voteOnPrompt);
// Create a new prompt (authenticated - could be admin only later)
router.post('/', auth_1.requireAuth, prompt_controller_1.createPrompt);
exports.default = router;
