"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listNotifications = listNotifications;
exports.markRead = markRead;
const Notification_1 = require("../models/Notification");
async function listNotifications(req, res) {
    const userId = req.user?.id;
    const { page = '1', limit = '20' } = req.query;
    const q = { user: userId };
    const cursor = Notification_1.Notification.find(q)
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));
    const [items, total] = await Promise.all([cursor, Notification_1.Notification.countDocuments(q)]);
    return res.json({ success: true, data: { items, total, page: Number(page), limit: Number(limit) } });
}
async function markRead(req, res) {
    const userId = req.user?.id;
    const { ids } = req.body;
    if (Array.isArray(ids) && ids.length > 0) {
        await Notification_1.Notification.updateMany({ _id: { $in: ids }, user: userId }, { $set: { read: true } });
    }
    else {
        await Notification_1.Notification.updateMany({ user: userId }, { $set: { read: true } });
    }
    return res.json({ success: true, data: { updated: true } });
}
