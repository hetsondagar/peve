"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listIdeas = listIdeas;
exports.getIdea = getIdea;
exports.createIdea = createIdea;
exports.joinIdea = joinIdea;
exports.respondJoin = respondJoin;
exports.convertIdea = convertIdea;
exports.likeIdea = likeIdea;
exports.compatibility = compatibility;
exports.getTrendingIdeas = getTrendingIdeas;
exports.bookmarkIdea = bookmarkIdea;
exports.getIdeaWithComments = getIdeaWithComments;
const Idea_1 = require("../models/Idea");
const User_1 = require("../models/User");
const Comment_1 = require("../models/Comment");
const compatibility_1 = require("../services/compatibility");
const bus_1 = require("../sockets/bus");
const badgeService_1 = require("../services/badgeService");
async function listIdeas(req, res) {
    try {
        const { page = '1', limit = '20', status, tags, author, sort = 'createdAt', difficulty, skillsNeeded, search } = req.query;
        const q = { isPublic: true };
        if (status)
            q.status = status;
        if (author)
            q.author = author;
        if (tags)
            q.tags = { $in: String(tags).split(',') };
        if (difficulty)
            q.difficulty = difficulty;
        if (skillsNeeded)
            q.skillsNeeded = { $in: String(skillsNeeded).split(',') };
        if (search) {
            q.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }
        let sortObj = { createdAt: -1 };
        if (sort === 'trending') {
            sortObj = { likes: -1, comments: -1, views: -1, createdAt: -1 };
        }
        else if (sort === 'popular') {
            sortObj = { likes: -1, createdAt: -1 };
        }
        else if (sort === 'recent') {
            sortObj = { createdAt: -1 };
        }
        const cursor = Idea_1.Idea.find(q)
            .populate('author', 'username name avatarUrl skills')
            .populate('collaborators.user', 'username name avatarUrl')
            .sort(sortObj)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        const [items, total] = await Promise.all([cursor, Idea_1.Idea.countDocuments(q)]);
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
        console.error('List ideas error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch ideas' });
    }
}
async function getIdea(req, res) {
    const idea = await Idea_1.Idea.findById(req.params.id).populate('author');
    if (!idea)
        return res.status(404).json({ success: false, error: 'Not found' });
    return res.json({ success: true, data: idea });
}
async function createIdea(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        const { title, description, tags, brand, mode, skillsNeeded, difficulty, estimatedTime } = req.body;
        if (!title || !description) {
            return res.status(400).json({ success: false, error: 'Title and description are required' });
        }
        const idea = await Idea_1.Idea.create({
            title,
            description,
            tags: tags || [],
            brand,
            mode: mode || 'brainstorm',
            skillsNeeded: skillsNeeded || [],
            difficulty: difficulty || 'beginner',
            estimatedTime,
            status: mode === 'want_to_build' ? 'planning' : 'brainstorm',
            author: userId
        });
        // Update user's stats
        await User_1.User.findByIdAndUpdate(userId, {
            $inc: { 'stats.ideasPosted': 1 }
        });
        const populatedIdea = await Idea_1.Idea.findById(idea._id)
            .populate('author', 'username name avatarUrl skills');
        // Check for badge awards
        try {
            await badgeService_1.BadgeService.checkAndAwardBadges(userId, 'idea_created', idea._id.toString());
        }
        catch (badgeError) {
            console.error('Error checking badges for idea creation:', badgeError);
        }
        return res.status(201).json({ success: true, data: populatedIdea });
    }
    catch (error) {
        console.error('Create idea error:', error);
        res.status(500).json({ success: false, error: 'Failed to create idea' });
    }
}
async function joinIdea(req, res) {
    const userId = req.user?.id;
    const { role, message } = req.body;
    const idea = await Idea_1.Idea.findById(req.params.id);
    if (!idea)
        return res.status(404).json({ success: false, error: 'Not found' });
    idea.requests.push({ user: userId, role, message, status: 'pending', createdAt: new Date() });
    await idea.save();
    (0, bus_1.emitToUser)(String(idea.author), 'idea:join_request', { ideaId: idea._id.toString() });
    return res.json({ success: true, data: { requestId: idea.requests[idea.requests.length - 1]._id, status: 'pending' } });
}
async function respondJoin(req, res) {
    const userId = req.user?.id;
    const { action } = req.body;
    const idea = await Idea_1.Idea.findById(req.params.id);
    if (!idea)
        return res.status(404).json({ success: false, error: 'Not found' });
    if (String(idea.author) !== String(userId))
        return res.status(403).json({ success: false, error: 'Forbidden' });
    const reqIdx = idea.requests.findIndex((r) => String(r._id) === req.params.requestId);
    if (reqIdx === -1)
        return res.status(404).json({ success: false, error: 'Request not found' });
    const r = idea.requests[reqIdx];
    r.status = action === 'accept' ? 'accepted' : 'rejected';
    if (action === 'accept')
        idea.collaborators.push({ user: r.user, role: r.role, joinedAt: new Date(), accepted: true });
    await idea.save();
    (0, bus_1.emitToUser)(String(r.user), 'idea:join_response', { ideaId: idea._id.toString(), status: r.status });
    (0, bus_1.emitToIdea)(String(idea._id), 'idea:updated', { ideaId: idea._id.toString() });
    return res.json({ success: true, data: { status: r.status } });
}
async function convertIdea(req, res) {
    // Placeholder; conversion to Project requires Project create – defer for projects endpoints
    return res.status(501).json({ success: false, error: 'Not implemented yet' });
}
async function likeIdea(req, res) {
    const idea = await Idea_1.Idea.findById(req.params.id);
    if (!idea)
        return res.status(404).json({ success: false, error: 'Not found' });
    idea.likes = (idea.likes || 0) + 1;
    await idea.save();
    return res.json({ success: true, data: { likes: idea.likes } });
}
async function compatibility(req, res) {
    try {
        const idea = await Idea_1.Idea.findById(req.params.id).populate('author');
        if (!idea)
            return res.status(404).json({ success: false, error: 'Not found' });
        const userB = await User_1.User.findById(req.query.userId);
        if (!userB)
            return res.status(404).json({ success: false, error: 'User not found' });
        const result = (0, compatibility_1.computeCompatibility)({ skills: idea.author?.skills, interests: idea.author?.interests }, { skills: userB.skills, interests: userB.interests }, { pastCollab: false, similarAvailability: false });
        return res.json({ success: true, data: result });
    }
    catch (error) {
        console.error('Compatibility error:', error);
        res.status(500).json({ success: false, error: 'Failed to calculate compatibility' });
    }
}
async function getTrendingIdeas(req, res) {
    try {
        const { limit = '10' } = req.query;
        // Get ideas with highest engagement
        const ideas = await Idea_1.Idea.find({ isPublic: true })
            .populate('author', 'username name avatarUrl skills')
            .sort({
            likes: -1,
            views: -1,
            comments: -1,
            createdAt: -1
        })
            .limit(Number(limit));
        res.json({ success: true, data: ideas });
    }
    catch (error) {
        console.error('Get trending ideas error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch trending ideas' });
    }
}
async function bookmarkIdea(req, res) {
    try {
        const userId = req.user?.id;
        const { ideaId } = req.params;
        const idea = await Idea_1.Idea.findById(ideaId);
        if (!idea) {
            return res.status(404).json({ success: false, error: 'Idea not found' });
        }
        const user = await User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        // Toggle bookmark
        const isBookmarked = user.bookmarkedIdeas.includes(ideaId);
        if (isBookmarked) {
            await User_1.User.findByIdAndUpdate(userId, {
                $pull: { bookmarkedIdeas: ideaId }
            });
        }
        else {
            await User_1.User.findByIdAndUpdate(userId, {
                $addToSet: { bookmarkedIdeas: ideaId }
            });
        }
        res.json({
            success: true,
            data: {
                bookmarked: !isBookmarked,
                message: !isBookmarked ? 'Idea bookmarked' : 'Bookmark removed'
            }
        });
    }
    catch (error) {
        console.error('Bookmark idea error:', error);
        res.status(500).json({ success: false, error: 'Failed to bookmark idea' });
    }
}
async function getIdeaWithComments(req, res) {
    try {
        const idea = await Idea_1.Idea.findById(req.params.id)
            .populate('author', 'username name avatarUrl bio skills')
            .populate('collaborators.user', 'username name avatarUrl skills');
        if (!idea) {
            return res.status(404).json({ success: false, error: 'Idea not found' });
        }
        // Increment view count
        await Idea_1.Idea.findByIdAndUpdate(req.params.id, {
            $inc: { views: 1 }
        });
        // Get comments for this idea
        const comments = await Comment_1.Comment.find({
            parentType: 'Idea',
            parentId: req.params.id
        })
            .populate('author', 'username name avatarUrl')
            .sort({ createdAt: -1 })
            .limit(20);
        return res.json({
            success: true,
            data: {
                idea,
                comments
            }
        });
    }
    catch (error) {
        console.error('Get idea with comments error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch idea' });
    }
}
