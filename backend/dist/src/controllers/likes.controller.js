"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleLikeIdea = toggleLikeIdea;
exports.toggleLikeProject = toggleLikeProject;
exports.getLikedByUsers = getLikedByUsers;
const Idea_1 = require("../models/Idea");
const Project_1 = require("../models/Project");
const User_1 = require("../models/User");
async function toggleLikeIdea(req, res) {
    try {
        const userId = req.user?.id;
        const { ideaId } = req.params;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Authentication required' });
        }
        const idea = await Idea_1.Idea.findById(ideaId);
        if (!idea) {
            return res.status(404).json({ success: false, error: 'Idea not found' });
        }
        const user = await User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        const isLiked = idea.likedBy.includes(userId);
        let action = '';
        if (isLiked) {
            // Unlike
            idea.likedBy = idea.likedBy.filter(id => id.toString() !== userId);
            idea.likes = Math.max(0, idea.likes - 1);
            action = 'unliked';
        }
        else {
            // Like
            idea.likedBy.push(userId);
            idea.likes += 1;
            action = 'liked';
            // Create notification for idea author (if not the same user)
            if (idea.author.toString() !== userId) {
                await User_1.User.findByIdAndUpdate(idea.author, {
                    $push: {
                        notifications: {
                            type: 'idea_liked',
                            message: `❤️ ${user.username || user.name} liked your idea: "${idea.title}"`,
                            relatedId: ideaId,
                            seen: false,
                            createdAt: new Date(),
                        }
                    }
                });
            }
        }
        await idea.save();
        return res.json({
            success: true,
            data: {
                action,
                likes: idea.likes,
                isLiked: !isLiked
            }
        });
    }
    catch (error) {
        console.error('Error toggling idea like:', error);
        res.status(500).json({ success: false, error: 'Failed to toggle like' });
    }
}
async function toggleLikeProject(req, res) {
    try {
        const userId = req.user?.id;
        const { projectId } = req.params;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Authentication required' });
        }
        const project = await Project_1.Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }
        const user = await User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        const isLiked = project.likedBy.includes(userId);
        let action = '';
        if (isLiked) {
            // Unlike
            project.likedBy = project.likedBy.filter(id => id.toString() !== userId);
            project.metrics.likes = Math.max(0, project.metrics.likes - 1);
            action = 'unliked';
        }
        else {
            // Like
            project.likedBy.push(userId);
            project.metrics.likes += 1;
            action = 'liked';
            // Create notification for project author (if not the same user)
            if (project.author.toString() !== userId) {
                await User_1.User.findByIdAndUpdate(project.author, {
                    $push: {
                        notifications: {
                            type: 'project_liked',
                            message: `❤️ ${user.username || user.name} liked your project: "${project.title}"`,
                            relatedId: projectId,
                            seen: false,
                            createdAt: new Date(),
                        }
                    }
                });
            }
        }
        await project.save();
        return res.json({
            success: true,
            data: {
                action,
                likes: project.metrics.likes,
                isLiked: !isLiked
            }
        });
    }
    catch (error) {
        console.error('Error toggling project like:', error);
        res.status(500).json({ success: false, error: 'Failed to toggle like' });
    }
}
async function getLikedByUsers(req, res) {
    try {
        const { type, id } = req.params; // type: 'idea' or 'project', id: ideaId or projectId
        if (type === 'idea') {
            const idea = await Idea_1.Idea.findById(id)
                .populate('likedBy', 'username name avatarUrl')
                .select('likedBy');
            if (!idea) {
                return res.status(404).json({ success: false, error: 'Idea not found' });
            }
            return res.json({
                success: true,
                data: idea.likedBy
            });
        }
        else if (type === 'project') {
            const project = await Project_1.Project.findById(id)
                .populate('likedBy', 'username name avatarUrl')
                .select('likedBy');
            if (!project) {
                return res.status(404).json({ success: false, error: 'Project not found' });
            }
            return res.json({
                success: true,
                data: project.likedBy
            });
        }
        else {
            return res.status(400).json({ success: false, error: 'Invalid type. Must be "idea" or "project"' });
        }
    }
    catch (error) {
        console.error('Error getting liked by users:', error);
        res.status(500).json({ success: false, error: 'Failed to get liked by users' });
    }
}
