"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComment = createComment;
exports.listComments = listComments;
exports.updateComment = updateComment;
exports.deleteComment = deleteComment;
const Comment_1 = require("../models/Comment");
async function createComment(req, res) {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    const { parentType, parentId, body, attachments } = req.body;
    const c = await Comment_1.Comment.create({ author: userId, parentType, parentId, body, attachments });
    return res.status(201).json({ success: true, data: c });
}
async function listComments(req, res) {
    const { parentType, parentId, page = '1', limit = '20' } = req.query;
    const q = { parentType, parentId };
    const cursor = Comment_1.Comment.find(q)
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));
    const [items, total] = await Promise.all([cursor, Comment_1.Comment.countDocuments(q)]);
    return res.json({ success: true, data: { items, total, page: Number(page), limit: Number(limit) } });
}
async function updateComment(req, res) {
    const userId = req.user?.id;
    const c = await Comment_1.Comment.findById(req.params.id);
    if (!c)
        return res.status(404).json({ success: false, error: 'Not found' });
    if (String(c.author) !== String(userId))
        return res.status(403).json({ success: false, error: 'Forbidden' });
    c.body = req.body.body ?? c.body;
    await c.save();
    return res.json({ success: true, data: c });
}
async function deleteComment(req, res) {
    const userId = req.user?.id;
    const c = await Comment_1.Comment.findById(req.params.id);
    if (!c)
        return res.status(404).json({ success: false, error: 'Not found' });
    if (String(c.author) !== String(userId))
        return res.status(403).json({ success: false, error: 'Forbidden' });
    await c.deleteOne();
    return res.json({ success: true, data: { deleted: true } });
}
