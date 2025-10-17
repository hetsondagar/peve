"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
router.get('/check-username', async (req, res) => {
    const { username } = req.query;
    if (!username)
        return res.status(400).json({ success: false, error: 'username required' });
    const exists = await User_1.User.exists({ username: String(username).toLowerCase() });
    return res.json({ success: true, data: { available: !exists } });
});
exports.default = router;
