"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const projects_controller_1 = require("../controllers/projects.controller");
const auth_1 = require("../middlewares/auth");
const analyzeGithubLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 40,
    standardHeaders: true,
    legacyHeaders: false,
});
const repositoryInsightsLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
});
const router = (0, express_1.Router)();
router.get('/', projects_controller_1.listProjects);
router.get('/trending', projects_controller_1.getTrendingProjects);
router.get('/contributor/:userId', projects_controller_1.getProjectsByContributor);
router.post('/analyze-github-repo', analyzeGithubLimiter, auth_1.requireAuth, projects_controller_1.analyzeGithubRepository);
router.get('/:id/repository-insights', repositoryInsightsLimiter, projects_controller_1.getRepositoryInsights);
router.get('/:id', projects_controller_1.getProject);
router.post('/', auth_1.requireAuth, projects_controller_1.createProject);
router.put('/:id', auth_1.requireAuth, projects_controller_1.updateProject);
router.delete('/:id', auth_1.requireAuth, projects_controller_1.deleteProject);
// Alias route to be robust against client variants
router.delete('/:projectId', auth_1.requireAuth, projects_controller_1.deleteProject);
router.post('/:id/health', auth_1.requireAuth, projects_controller_1.recalcHealth);
router.post('/:id/fork', auth_1.requireAuth, projects_controller_1.forkProject);
router.post('/:projectId/like', auth_1.requireAuth, projects_controller_1.likeProject);
router.post('/:projectId/bookmark', auth_1.requireAuth, projects_controller_1.bookmarkProject);
router.post('/:projectId/share', projects_controller_1.shareProject);
router.post('/:projectId/collaborate', auth_1.requireAuth, projects_controller_1.requestCollaboration);
exports.default = router;
