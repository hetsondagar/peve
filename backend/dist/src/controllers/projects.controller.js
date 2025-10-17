"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProjects = listProjects;
exports.getProject = getProject;
exports.createProject = createProject;
exports.updateProject = updateProject;
exports.recalcHealth = recalcHealth;
exports.forkProject = forkProject;
exports.getTrendingProjects = getTrendingProjects;
exports.likeProject = likeProject;
exports.bookmarkProject = bookmarkProject;
exports.shareProject = shareProject;
exports.requestCollaboration = requestCollaboration;
const Project_1 = require("../models/Project");
const User_1 = require("../models/User");
const Comment_1 = require("../models/Comment");
const badgeService_1 = require("../services/badgeService");
async function listProjects(req, res) {
    try {
        const { page = '1', limit = '20', tech, author, status, featured, sortBy = 'createdAt', sortOrder = 'desc', search } = req.query;
        const q = { visibility: 'public', isDraft: false };
        if (tech)
            q.techStack = { $in: String(tech).split(',') };
        if (author)
            q.author = author;
        if (status)
            q.status = status;
        if (featured === 'true')
            q.featured = true;
        if (search) {
            q.$or = [
                { title: { $regex: search, $options: 'i' } },
                { tagline: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } },
                { keyFeatures: { $in: [new RegExp(search, 'i')] } }
            ];
        }
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        const cursor = Project_1.Project.find(q)
            .populate('author', 'username name avatarUrl')
            .populate('contributors.user', 'username name avatarUrl')
            .sort(sort)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        const [items, total] = await Promise.all([cursor, Project_1.Project.countDocuments(q)]);
        return res.json({
            success: true,
            data: {
                items,
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('List projects error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch projects' });
    }
}
async function getProject(req, res) {
    try {
        const project = await Project_1.Project.findById(req.params.id)
            .populate('author', 'username name avatarUrl bio skills')
            .populate('contributors.user', 'username name avatarUrl skills');
        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }
        // Increment view count
        await Project_1.Project.findByIdAndUpdate(req.params.id, {
            $inc: { 'metrics.views': 1 }
        });
        // Get comments for this project
        const comments = await Comment_1.Comment.find({
            targetType: 'project',
            targetId: req.params.id
        })
            .populate('author', 'username name avatarUrl')
            .sort({ createdAt: -1 })
            .limit(20);
        return res.json({
            success: true,
            data: {
                project,
                comments
            }
        });
    }
    catch (error) {
        console.error('Get project error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch project' });
    }
}
async function createProject(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        // Validate required fields
        const { title, tagline, description, category, links } = req.body;
        if (!title || !tagline || !description || !category || !links?.githubRepo) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: title, tagline, description, category, and githubRepo are required'
            });
        }
        // Add teammates as tags if they exist
        const projectData = { ...req.body };
        if (projectData.collaboration?.teammates && projectData.collaboration.teammates.length > 0) {
            // Add teammates as tags with @ prefix
            const teammateTags = projectData.collaboration.teammates.map((teammate) => `@${teammate}`);
            projectData.tags = [...(projectData.tags || []), ...teammateTags];
        }
        const project = await Project_1.Project.create({
            ...projectData,
            author: userId,
            metrics: {
                views: 0,
                likes: 0,
                comments: 0,
                saves: 0,
                shares: 0
            }
        });
        // Award badge for first project
        const user = await User_1.User.findById(userId);
        if (user && user.stats?.projectsUploaded === 0) {
            await User_1.User.findByIdAndUpdate(userId, {
                $inc: { 'stats.projectsUploaded': 1 }
            });
            // Note: Badge system will be implemented separately with proper ObjectId references
        }
        else if (user) {
            await User_1.User.findByIdAndUpdate(userId, {
                $inc: { 'stats.projectsUploaded': 1 }
            });
        }
        const populatedProject = await Project_1.Project.findById(project._id)
            .populate('author', 'username name avatarUrl')
            .populate('contributors.user', 'username name avatarUrl');
        // Check for badge awards
        try {
            await badgeService_1.BadgeService.checkAndAwardBadges(userId, 'project_created', project._id.toString());
        }
        catch (badgeError) {
            console.error('Error checking badges for project creation:', badgeError);
        }
        return res.status(201).json({ success: true, data: populatedProject });
    }
    catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({ success: false, error: 'Failed to create project' });
    }
}
async function updateProject(req, res) {
    const userId = req.user?.id;
    const project = await Project_1.Project.findById(req.params.id);
    if (!project)
        return res.status(404).json({ success: false, error: 'Not found' });
    if (String(project.author) !== String(userId))
        return res.status(403).json({ success: false, error: 'Forbidden' });
    Object.assign(project, req.body);
    await project.save();
    return res.json({ success: true, data: project });
}
async function recalcHealth(req, res) {
    const project = await Project_1.Project.findById(req.params.id);
    if (!project)
        return res.status(404).json({ success: false, error: 'Not found' });
    // naive placeholder health score until full rules
    project.healthScore = Math.min(100, Math.max(0, (project.metrics?.likes || 0) + 50));
    await project.save();
    return res.json({ success: true, data: { healthScore: project.healthScore } });
}
async function forkProject(req, res) {
    try {
        const userId = req.user?.id;
        const project = await Project_1.Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }
        const fork = await Project_1.Project.create({
            title: project.title + ' (fork)',
            tagline: project.tagline,
            description: project.description,
            author: userId,
            contributors: [],
            techStack: project.techStack,
            category: project.category,
            difficultyLevel: project.difficultyLevel,
            developmentStage: 'idea',
            coverImage: project.coverImage,
            screenshots: project.screenshots,
            keyFeatures: project.keyFeatures,
            links: project.links,
            collaboration: {
                openToCollaboration: true,
                lookingForRoles: [],
                teammates: []
            },
            badges: [],
            visibility: 'public',
            isDraft: false,
            tags: project.tags,
            status: 'planning',
            metrics: {
                views: 0,
                likes: 0,
                forks: 0,
                comments: 0,
                stars: 0,
                saves: 0,
                shares: 0
            }
        });
        // Increment fork count on original project
        await Project_1.Project.findByIdAndUpdate(req.params.id, {
            $inc: { 'metrics.forks': 1 }
        });
        return res.json({ success: true, data: fork });
    }
    catch (error) {
        console.error('Fork project error:', error);
        res.status(500).json({ success: false, error: 'Failed to fork project' });
    }
}
async function getTrendingProjects(req, res) {
    try {
        const { limit = '10' } = req.query;
        // Get projects with highest engagement (likes + views + comments)
        const projects = await Project_1.Project.find({ visibility: 'public', isDraft: false })
            .populate('author', 'username name avatarUrl')
            .sort({
            'metrics.likes': -1,
            'metrics.views': -1,
            'metrics.comments': -1,
            createdAt: -1
        })
            .limit(Number(limit));
        res.json({ success: true, data: projects });
    }
    catch (error) {
        console.error('Get trending projects error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch trending projects' });
    }
}
async function likeProject(req, res) {
    try {
        const userId = req.user?.id;
        const { projectId } = req.params;
        const project = await Project_1.Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }
        // Check if user already liked this project
        const user = await User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        // For now, just increment like count (in a real app, you'd track individual likes)
        await Project_1.Project.findByIdAndUpdate(projectId, {
            $inc: { 'metrics.likes': 1 }
        });
        // Update user's stats
        await User_1.User.findByIdAndUpdate(userId, {
            $inc: { 'stats.likesReceived': 1 }
        });
        res.json({ success: true, message: 'Project liked successfully' });
    }
    catch (error) {
        console.error('Like project error:', error);
        res.status(500).json({ success: false, error: 'Failed to like project' });
    }
}
async function bookmarkProject(req, res) {
    try {
        const userId = req.user?.id;
        const { projectId } = req.params;
        const project = await Project_1.Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }
        const user = await User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        // Toggle bookmark
        const isBookmarked = user.bookmarkedProjects.includes(projectId);
        if (isBookmarked) {
            await User_1.User.findByIdAndUpdate(userId, {
                $pull: { bookmarkedProjects: projectId }
            });
            await Project_1.Project.findByIdAndUpdate(projectId, {
                $inc: { 'metrics.saves': -1 }
            });
        }
        else {
            await User_1.User.findByIdAndUpdate(userId, {
                $addToSet: { bookmarkedProjects: projectId }
            });
            await Project_1.Project.findByIdAndUpdate(projectId, {
                $inc: { 'metrics.saves': 1 }
            });
        }
        res.json({
            success: true,
            data: {
                bookmarked: !isBookmarked,
                message: !isBookmarked ? 'Project bookmarked' : 'Bookmark removed'
            }
        });
    }
    catch (error) {
        console.error('Bookmark project error:', error);
        res.status(500).json({ success: false, error: 'Failed to bookmark project' });
    }
}
async function shareProject(req, res) {
    try {
        const { projectId } = req.params;
        const project = await Project_1.Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }
        // Increment share count
        await Project_1.Project.findByIdAndUpdate(projectId, {
            $inc: { 'metrics.shares': 1 }
        });
        res.json({
            success: true,
            data: {
                message: 'Project shared successfully',
                shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/projects/${projectId}`
            }
        });
    }
    catch (error) {
        console.error('Share project error:', error);
        res.status(500).json({ success: false, error: 'Failed to share project' });
    }
}
async function requestCollaboration(req, res) {
    try {
        const userId = req.user?.id;
        const { projectId } = req.params;
        const { message, role } = req.body;
        const project = await Project_1.Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }
        if (!project.collaboration?.openToCollaboration) {
            return res.status(400).json({
                success: false,
                error: 'This project is not open to collaboration'
            });
        }
        // In a real app, you'd create a collaboration request record
        // For now, we'll just return success
        res.json({
            success: true,
            data: {
                message: 'Collaboration request sent successfully',
                projectTitle: project.title,
                authorUsername: project.author
            }
        });
    }
    catch (error) {
        console.error('Request collaboration error:', error);
        res.status(500).json({ success: false, error: 'Failed to send collaboration request' });
    }
}
