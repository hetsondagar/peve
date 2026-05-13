"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeGithubRepository = analyzeGithubRepository;
exports.getRepositoryInsights = getRepositoryInsights;
exports.listProjects = listProjects;
exports.getProjectsByContributor = getProjectsByContributor;
exports.getProject = getProject;
exports.createProject = createProject;
exports.updateProject = updateProject;
exports.deleteProject = deleteProject;
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
const CollaborationRequest_1 = require("../models/CollaborationRequest");
const Notification_1 = require("../models/Notification");
const badgeService_1 = require("../services/badgeService");
const githubRepoAnalysis_service_1 = require("../services/githubRepoAnalysis.service");
const env_1 = require("../config/env");
const mlIntelligenceClient_1 = require("../services/mlIntelligenceClient");
const projectPayloadSanitize_1 = require("../utils/projectPayloadSanitize");
async function analyzeGithubRepository(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }
        const { repoUrl } = req.body || {};
        if (!repoUrl || typeof repoUrl !== 'string') {
            return res.status(400).json({ success: false, error: 'repoUrl is required' });
        }
        const token = process.env.GITHUB_TOKEN || process.env.GITHUB_REPO_ANALYSIS_TOKEN || '';
        const { autofill, readmeExcerpt } = await (0, githubRepoAnalysis_service_1.fetchGithubRepoAutofill)(repoUrl, token || undefined);
        const parsed = (0, githubRepoAnalysis_service_1.parseGithubRepoUrl)(autofill.githubRepo);
        const activity = parsed
            ? await (0, githubRepoAnalysis_service_1.fetchGithubRepoActivity)(parsed.owner, parsed.repo, token || undefined)
            : { commitTimeline: [], contributorLeaders: [], commitMessageSample: '' };
        const autofillForMl = {
            ...autofill,
            commitMessageSample: activity.commitMessageSample,
        };
        const { intelligence, fetchFailure } = await (0, mlIntelligenceClient_1.fetchMlRepositoryIntelligence)(autofillForMl, readmeExcerpt);
        const mlUrlConfigured = Boolean(env_1.env.mlServiceUrl?.trim());
        const mlMessage = intelligence == null
            ? mlUrlConfigured
                ? (0, mlIntelligenceClient_1.formatMlMissingUserMessage)('analyze', fetchFailure)
                : 'Set ML_SERVICE_URL on this API to your Peve ML service base URL (SentenceTransformers + sklearn; no LLM API key required).'
            : undefined;
        const data = {
            ...autofill,
            ...activity,
            intelligence: intelligence ?? null,
        };
        return res.json({
            success: true,
            data,
            ...(mlMessage ? { message: mlMessage } : {}),
        });
    }
    catch (error) {
        console.error('analyzeGithubRepository:', error);
        return res.status(400).json({
            success: false,
            error: error?.message || 'Failed to analyze repository',
        });
    }
}
async function getRepositoryInsights(req, res) {
    try {
        const { id } = req.params;
        const project = await Project_1.Project.findById(id).lean();
        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }
        const viewerId = req.user?.id;
        const isAuthor = viewerId && String(project.author) === String(viewerId);
        if (project.visibility === 'private' && !isAuthor) {
            return res.status(403).json({ success: false, error: 'Forbidden' });
        }
        if (project.visibility === 'friends-only' && !isAuthor) {
            return res.status(403).json({ success: false, error: 'Forbidden' });
        }
        const repoUrl = project.links?.githubRepo;
        if (!repoUrl || !(0, githubRepoAnalysis_service_1.parseGithubRepoUrl)(repoUrl)) {
            return res.json({
                success: true,
                data: null,
                message: 'Add a GitHub repository URL to this project to unlock repository intelligence.',
            });
        }
        const token = process.env.GITHUB_TOKEN || process.env.GITHUB_REPO_ANALYSIS_TOKEN || '';
        const { autofill, readmeExcerpt } = await (0, githubRepoAnalysis_service_1.fetchGithubRepoAutofill)(repoUrl, token || undefined);
        const parsed = (0, githubRepoAnalysis_service_1.parseGithubRepoUrl)(autofill.githubRepo);
        const activity = parsed
            ? await (0, githubRepoAnalysis_service_1.fetchGithubRepoActivity)(parsed.owner, parsed.repo, token || undefined)
            : { commitTimeline: [], contributorLeaders: [], commitMessageSample: '' };
        const autofillForMl = {
            ...autofill,
            commitMessageSample: activity.commitMessageSample,
        };
        const baseInsights = (0, githubRepoAnalysis_service_1.buildRepositoryInsights)(autofill, autofill.githubRepo);
        const { intelligence, fetchFailure } = await (0, mlIntelligenceClient_1.fetchMlRepositoryIntelligence)(autofillForMl, readmeExcerpt);
        let data = {
            ...baseInsights,
            ...activity,
            intelligence: intelligence ?? null,
        };
        if (intelligence) {
            data = {
                ...data,
                peveScorePreview: (0, mlIntelligenceClient_1.blendPeveScore)(baseInsights.peveScorePreview, intelligence.peve_score_ml),
                scoreRationale: `${baseInsights.scoreRationale} Blended with ML repository intelligence (embeddings + tabular scoring).`,
            };
        }
        const mlUrlConfigured = Boolean(env_1.env.mlServiceUrl?.trim());
        const message = intelligence == null
            ? mlUrlConfigured
                ? (0, mlIntelligenceClient_1.formatMlMissingUserMessage)('project', fetchFailure)
                : 'GitHub is linked. Set ML_SERVICE_URL on this API to the base URL of your Peve ML service (traditional ML: SentenceTransformers + sklearn — no LLM API key required).'
            : undefined;
        return res.json({ success: true, data, ...(message ? { message } : {}) });
    }
    catch (error) {
        console.error('getRepositoryInsights:', error);
        return res.status(400).json({
            success: false,
            error: error?.message || 'Failed to load repository insights',
        });
    }
}
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
            .populate('author', 'username name avatarUrl avatarStyle bio skills')
            .populate('contributors.user', 'username name avatarUrl avatarStyle bio skills')
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
async function getProjectsByContributor(req, res) {
    try {
        const userId = req.params.userId;
        // Get projects where user is a contributor
        const projects = await Project_1.Project.find({
            'contributors.user': userId,
            visibility: 'public',
            isDraft: false
        })
            .populate('author', 'username name avatarUrl avatarStyle bio skills')
            .populate('contributors.user', 'username name avatarUrl avatarStyle bio skills')
            .sort({ createdAt: -1 });
        // Add collaborator flag to each project
        const projectsWithFlag = projects.map(project => ({
            ...project.toObject(),
            isCollaborator: true
        }));
        return res.json({
            success: true,
            data: { projects: projectsWithFlag }
        });
    }
    catch (error) {
        console.error('Get projects by contributor error:', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch projects' });
    }
}
async function getProject(req, res) {
    try {
        const project = await Project_1.Project.findById(req.params.id)
            .populate('author', 'username name avatarUrl avatarStyle bio skills')
            .populate('contributors.user', 'username name avatarUrl avatarStyle bio skills');
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
        // Process contributors and teammates (loose shape from client; strip analyze-only keys)
        const projectData = { ...req.body };
        (0, projectPayloadSanitize_1.stripEphemeralProjectFields)(projectData);
        // Initialize contributors array
        projectData.contributors = [];
        // Handle contributors (from frontend collaborators field)
        if (projectData.collaborators && Array.isArray(projectData.collaborators) && projectData.collaborators.length > 0) {
            const contributors = projectData.collaborators
                .map((c) => {
                if (c && typeof c === 'object') {
                    const name = (c.name || '').trim();
                    const role = (c.role || '').trim();
                    if (name) {
                        return { name, role: role || 'Contributor', contributions: 'Project contributor' };
                    }
                }
                else if (typeof c === 'string') {
                    const name = c.trim();
                    if (name)
                        return { name, role: 'Contributor', contributions: 'Project contributor' };
                }
                return null;
            })
                .filter(Boolean);
            projectData.contributors = contributors;
        }
        // Remove collaborators field to avoid conflicts with schema
        delete projectData.collaborators;
        // Handle collaboration teammates
        if (projectData.collaboration?.teammates && Array.isArray(projectData.collaboration.teammates) && projectData.collaboration.teammates.length > 0) {
            // Validate that all teammates exist as users
            const validTeammates = [];
            for (const teammate of projectData.collaboration.teammates) {
                // Handle both string usernames and object format
                const username = typeof teammate === 'string' ? teammate : teammate.username || teammate.user;
                if (username && typeof username === 'string' && username.trim()) {
                    const user = await User_1.User.findOne({ username: username.trim().toLowerCase() });
                    if (user) {
                        validTeammates.push(user._id);
                    }
                }
            }
            // Update the teammates array to only include valid user IDs
            projectData.collaboration.teammates = validTeammates;
        }
        else if (projectData.collaboration) {
            // Ensure collaboration object has correct structure
            projectData.collaboration = {
                openToCollaboration: projectData.collaboration.openToCollaboration || false,
                lookingForRoles: projectData.collaboration.lookingForRoles || [],
                teammates: []
            };
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
            .populate('author', 'username name avatarUrl avatarStyle bio skills')
            .populate('contributors.user', 'username name avatarUrl avatarStyle bio skills');
        // Check for badge awards
        try {
            console.log('Checking badges for project creation...');
            await badgeService_1.BadgeService.checkAndAwardBadges(userId, 'project_created', project._id.toString());
            console.log('Badge check completed successfully');
        }
        catch (badgeError) {
            console.error('Error checking badges for project creation:', badgeError);
            console.error('Badge error details:', badgeError.message);
            console.error('Badge error stack:', badgeError.stack);
        }
        return res.status(201).json({ success: true, data: populatedProject });
    }
    catch (error) {
        console.error('Create project error:', error);
        console.error('Error details:', error?.message);
        console.error('Stack trace:', error?.stack);
        console.error('Request body:', req.body);
        // Return more specific error message
        const errorMessage = error?.message || 'Failed to create project';
        return res.status(500).json({
            success: false,
            error: errorMessage,
            details: error?.stack
        });
    }
}
async function updateProject(req, res) {
    try {
        const userId = req.user?.id;
        const project = await Project_1.Project.findById(req.params.id);
        if (!project)
            return res.status(404).json({ success: false, error: 'Not found' });
        if (String(project.author) !== String(userId))
            return res.status(403).json({ success: false, error: 'Forbidden' });
        // Process contributors and teammates (loose shape from client; strip analyze-only keys)
        const updateData = { ...req.body };
        (0, projectPayloadSanitize_1.stripEphemeralProjectFields)(updateData);
        // Initialize contributors array
        updateData.contributors = [];
        // Handle contributors (from frontend collaborators field)
        if (updateData.collaborators && Array.isArray(updateData.collaborators) && updateData.collaborators.length > 0) {
            const contributors = updateData.collaborators
                .map((c) => {
                if (c && typeof c === 'object') {
                    const name = (c.name || '').trim();
                    const role = (c.role || '').trim();
                    if (name) {
                        return { name, role: role || 'Contributor', contributions: 'Project contributor' };
                    }
                }
                else if (typeof c === 'string') {
                    const name = c.trim();
                    if (name)
                        return { name, role: 'Contributor', contributions: 'Project contributor' };
                }
                return null;
            })
                .filter(Boolean);
            updateData.contributors = contributors;
        }
        // Remove collaborators field to avoid conflicts with schema
        delete updateData.collaborators;
        // Handle collaboration teammates
        if (updateData.collaboration?.teammates && Array.isArray(updateData.collaboration.teammates) && updateData.collaboration.teammates.length > 0) {
            // Validate that all teammates exist as users
            const validTeammates = [];
            for (const teammate of updateData.collaboration.teammates) {
                // Handle both string usernames and object format
                const username = typeof teammate === 'string' ? teammate : teammate.username || teammate.user;
                if (username && typeof username === 'string' && username.trim()) {
                    const user = await User_1.User.findOne({ username: username.trim().toLowerCase() });
                    if (user) {
                        validTeammates.push(user._id);
                    }
                }
            }
            // Update the teammates array to only include valid user IDs
            updateData.collaboration.teammates = validTeammates;
        }
        else if (updateData.collaboration) {
            // Ensure collaboration object has correct structure
            updateData.collaboration = {
                openToCollaboration: updateData.collaboration.openToCollaboration || false,
                lookingForRoles: updateData.collaboration.lookingForRoles || [],
                teammates: []
            };
        }
        Object.assign(project, updateData);
        await project.save();
        // Populate the project with author and contributors data
        const updatedProject = await Project_1.Project.findById(project._id)
            .populate('author', 'username name avatarUrl avatarStyle bio skills')
            .populate('contributors.user', 'username name avatarUrl avatarStyle bio skills');
        return res.json({ success: true, data: updatedProject });
    }
    catch (error) {
        console.error('Update project error:', error);
        return res.status(500).json({ success: false, error: 'Failed to update project' });
    }
}
async function deleteProject(req, res) {
    try {
        const rawId = req.params.id || req.params.projectId;
        const paramId = typeof rawId === 'string' ? rawId.trim() : rawId;
        console.log('Delete project request - ID:', paramId);
        const userId = req.user?.id;
        console.log('User ID:', userId);
        if (!paramId) {
            return res.status(400).json({ success: false, error: 'Project ID is required' });
        }
        let project = null;
        try {
            project = await Project_1.Project.findById(paramId);
        }
        catch (castErr) {
            // If casting fails (e.g., non-ObjectId), try direct string match (in case _id stored as string)
            project = await Project_1.Project.findOne({ _id: paramId });
        }
        console.log('Project found:', !!project);
        if (!project) {
            console.log('Project not found for ID:', paramId);
            return res.status(404).json({ success: false, error: 'Project not found' });
        }
        // Check if user is the author
        if (String(project.author) !== String(userId)) {
            console.log('User is not the author of the project');
            return res.status(403).json({ success: false, error: 'Forbidden' });
        }
        console.log('Starting project deletion...');
        // Delete associated comments
        await Comment_1.Comment.deleteMany({ targetType: 'project', targetId: project._id });
        console.log('Comments deleted');
        // Delete associated collaboration requests
        await CollaborationRequest_1.CollaborationRequest.deleteMany({ project: project._id });
        console.log('Collaboration requests deleted');
        // Delete the project
        await Project_1.Project.findByIdAndDelete(paramId);
        console.log('Project deleted successfully');
        return res.json({ success: true, message: 'Project deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting project:', error);
        return res.status(500).json({ success: false, error: 'Failed to delete project' });
    }
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
            .populate('author', 'username name avatarUrl avatarStyle bio skills')
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
        const project = await Project_1.Project.findById(projectId).populate('author', 'username name');
        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }
        if (!project.collaboration?.openToCollaboration) {
            return res.status(400).json({
                success: false,
                error: 'This project is not open to collaboration'
            });
        }
        // Check if user is trying to collaborate on their own project
        if (project.author._id.toString() === userId) {
            return res.status(400).json({
                success: false,
                error: 'Cannot send collaboration request to yourself'
            });
        }
        // Check if request already exists
        const existingRequest = await CollaborationRequest_1.CollaborationRequest.findOne({
            projectId,
            requesterId: userId
        });
        if (existingRequest) {
            return res.status(400).json({
                success: false,
                error: 'Request already sent for this project'
            });
        }
        // Create collaboration request
        const collaborationRequest = await CollaborationRequest_1.CollaborationRequest.create({
            projectId,
            requesterId: userId,
            receiverId: project.author._id,
            compatibilityScore: 0, // Default score for project collaboration
            message: message || '',
            role: role || ''
        });
        // Create notification for project owner
        const requester = await User_1.User.findById(userId).select('username name');
        await Notification_1.Notification.create({
            user: project.author._id,
            type: 'collaboration_request',
            data: {
                requesterId: userId,
                requesterName: requester?.username,
                projectId: projectId,
                projectTitle: project.title,
                collaborationRequestId: collaborationRequest._id,
                message: message || '',
                role: role || ''
            }
        });
        // Add to users' tracking arrays
        await Promise.all([
            User_1.User.findByIdAndUpdate(userId, {
                $push: { collabRequestsSent: collaborationRequest._id }
            }),
            User_1.User.findByIdAndUpdate(project.author._id, {
                $push: { collabRequestsReceived: collaborationRequest._id }
            })
        ]);
        res.json({
            success: true,
            data: {
                message: 'Collaboration request sent successfully',
                projectTitle: project.title,
                authorUsername: project.author.username,
                collaborationRequestId: collaborationRequest._id
            }
        });
    }
    catch (error) {
        console.error('Request collaboration error:', error);
        res.status(500).json({ success: false, error: 'Failed to send collaboration request' });
    }
}
