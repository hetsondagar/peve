"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projects_controller_1 = require("../controllers/projects.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
const Project_1 = require("../models/Project");
const Comment_1 = require("../models/Comment");
const CollaborationRequest_1 = require("../models/CollaborationRequest");
router.get('/', projects_controller_1.listProjects);
router.get('/trending', projects_controller_1.getTrendingProjects);
router.get('/:id', projects_controller_1.getProject);
router.post('/', auth_1.requireAuth, projects_controller_1.createProject);
router.put('/:id', auth_1.requireAuth, projects_controller_1.updateProject);
// DELETE project (dist hotfix)
router.delete('/:id', auth_1.requireAuth, async (req, res) => {
    try {
        const projectId = req.params.id;
        const userId = req.user?.id;
        if (!projectId) {
            return res.status(400).json({ success: false, error: 'Project ID is required' });
        }
        let project = null;
        try {
            project = await Project_1.Project.findById(projectId);
        }
        catch (e) {
            project = await Project_1.Project.findOne({ _id: projectId });
        }
        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }
        if (String(project.author) !== String(userId)) {
            return res.status(403).json({ success: false, error: 'Forbidden' });
        }
        await Comment_1.Comment.deleteMany({ targetType: 'project', targetId: project._id });
        await CollaborationRequest_1.CollaborationRequest.deleteMany({ project: project._id });
        await Project_1.Project.findByIdAndDelete(projectId);
        return res.json({ success: true, message: 'Project deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting project (dist hotfix):', error);
        return res.status(500).json({ success: false, error: 'Failed to delete project' });
    }
});
router.post('/:id/health', auth_1.requireAuth, projects_controller_1.recalcHealth);
router.post('/:id/fork', auth_1.requireAuth, projects_controller_1.forkProject);
router.post('/:projectId/like', auth_1.requireAuth, projects_controller_1.likeProject);
router.post('/:projectId/bookmark', auth_1.requireAuth, projects_controller_1.bookmarkProject);
router.post('/:projectId/share', projects_controller_1.shareProject);
router.post('/:projectId/collaborate', auth_1.requireAuth, projects_controller_1.requestCollaboration);
exports.default = router;
