"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = getCurrentUser;
exports.updateProfile = updateProfile;
exports.getUserById = getUserById;
exports.searchUsers = searchUsers;
const User_1 = require("../models/User");
async function getCurrentUser(req, res) {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    try {
        const user = await User_1.User.findById(userId).select('-passwordHash');
        if (!user)
            return res.status(404).json({ success: false, error: 'User not found' });
        return res.json({ success: true, data: user });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: 'Failed to fetch user' });
    }
}
async function updateProfile(req, res) {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    const { skills, bio, college, role, interests, githubUsername, linkedinUrl, portfolioUrl } = req.body;
    try {
        const updateData = {};
        if (skills !== undefined)
            updateData.skills = skills;
        if (bio !== undefined)
            updateData.bio = bio;
        if (college !== undefined)
            updateData.college = college;
        if (role !== undefined)
            updateData.role = role;
        if (interests !== undefined)
            updateData.interests = interests;
        if (githubUsername !== undefined)
            updateData.githubUsername = githubUsername;
        if (linkedinUrl !== undefined)
            updateData.linkedinUrl = linkedinUrl;
        if (portfolioUrl !== undefined)
            updateData.portfolioUrl = portfolioUrl;
        const user = await User_1.User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select('-passwordHash');
        if (!user)
            return res.status(404).json({ success: false, error: 'User not found' });
        return res.json({ success: true, data: user });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: 'Failed to update profile' });
    }
}
async function getUserById(req, res) {
    const { userId } = req.params;
    try {
        const user = await User_1.User.findById(userId).select('-passwordHash -email');
        if (!user)
            return res.status(404).json({ success: false, error: 'User not found' });
        return res.json({ success: true, data: user });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: 'Failed to fetch user' });
    }
}
async function searchUsers(req, res) {
    const { q, skills, page = 1, limit = 20 } = req.query;
    try {
        const query = {};
        if (q) {
            query.$or = [
                { name: { $regex: q, $options: 'i' } },
                { username: { $regex: q, $options: 'i' } },
                { bio: { $regex: q, $options: 'i' } }
            ];
        }
        if (skills) {
            const skillArray = Array.isArray(skills) ? skills : [skills];
            query.skills = { $in: skillArray };
        }
        const users = await User_1.User.find(query)
            .select('-passwordHash -email')
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit))
            .sort({ createdAt: -1 });
        const total = await User_1.User.countDocuments(query);
        return res.json({
            success: true,
            data: {
                items: users,
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: 'Failed to search users' });
    }
}
