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
const Idea_1 = require("../models/Idea");
const User_1 = require("../models/User");
const compatibility_1 = require("../services/compatibility");
const bus_1 = require("../sockets/bus");
async function listIdeas(req, res) {
    const { page = '1', limit = '20', status, tags, author, sort } = req.query;
    const q = {};
    if (status)
        q.status = status;
    if (author)
        q.author = author;
    if (tags)
        q.tags = { $in: String(tags).split(',') };
    const cursor = Idea_1.Idea.find(q)
        .sort(sort === 'trending' ? { likes: -1, comments: -1, views: -1 } : { createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));
    const [items, total] = await Promise.all([cursor, Idea_1.Idea.countDocuments(q)]);
    return res.json({ success: true, data: { items, total, page: Number(page), limit: Number(limit) } });
}
async function getIdea(req, res) {
    const idea = await Idea_1.Idea.findById(req.params.id).populate('author');
    if (!idea)
        return res.status(404).json({ success: false, error: 'Not found' });
    return res.json({ success: true, data: idea });
}
async function createIdea(req, res) {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    const { title, description, tags, brand, mode } = req.body;
    if (!title)
        return res.status(400).json({ success: false, error: 'Title required' });
    const idea = await Idea_1.Idea.create({ title, description, tags, brand, status: mode === 'want_to_build' ? 'want_to_build' : 'brainstorm', author: userId });
    return res.status(201).json({ success: true, data: idea });
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
    const idea = await Idea_1.Idea.findById(req.params.id).populate('author');
    if (!idea)
        return res.status(404).json({ success: false, error: 'Not found' });
    const userB = await User_1.User.findById(req.query.userId);
    if (!userB)
        return res.status(404).json({ success: false, error: 'User not found' });
    const result = (0, compatibility_1.computeCompatibility)({ skills: idea.author?.skills, interests: idea.author?.interests }, { skills: userB.skills, interests: userB.interests }, { pastCollab: false, similarAvailability: false });
    return res.json({ success: true, data: result });
}
