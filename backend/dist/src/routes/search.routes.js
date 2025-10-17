"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const search_controller_1 = require("../controllers/search.controller");
const router = (0, express_1.Router)();
// Search all content types
router.get('/', search_controller_1.searchAll);
// Search specific content types
router.get('/projects', search_controller_1.searchProjects);
router.get('/ideas', search_controller_1.searchIdeas);
router.get('/users', search_controller_1.searchUsers);
exports.default = router;
