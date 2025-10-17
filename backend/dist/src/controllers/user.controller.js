"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = getUserById;
exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.getUsers = getUsers;
const User_1 = require("../models/User");
async function getUserById(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'User ID is required'
            });
        }
        const user = await User_1.User.findById(id)
            .select('-passwordHash -mobileNumber') // Exclude sensitive information
            .populate('badges', 'name description icon')
            .lean();
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        return res.json({
            success: true,
            data: user
        });
    }
    catch (error) {
        console.error('Get user by ID error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}
async function getUsers(req, res) {
    try {
        const { search, limit = 20, page = 1 } = req.query;
        const query = {};
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } }
            ];
        }
        const skip = (Number(page) - 1) * Number(limit);
        const users = await User_1.User.find(query)
            .select('-passwordHash -mobileNumber') // Exclude sensitive information
            .populate('badges', 'name description icon')
            .sort({ reputation: -1, createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean();
        const total = await User_1.User.countDocuments(query);
        return res.json({
            success: true,
            data: {
                users,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit))
                }
            }
        });
    }
    catch (error) {
        console.error('Get users error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}
async function getUserById(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'User ID is required'
            });
        }
        const user = await User_1.User.findById(id)
            .select('-passwordHash -mobileNumber') // Exclude sensitive information
            .populate('badges', 'name description icon')
            .lean();
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        return res.json({
            success: true,
            data: user
        });
    }
    catch (error) {
        console.error('Get user by ID error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}
async function getUsers(req, res) {
    try {
        const { search, limit = 20, page = 1 } = req.query;
        const query = {};
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } }
            ];
        }
        const skip = (Number(page) - 1) * Number(limit);
        const users = await User_1.User.find(query)
            .select('-passwordHash -mobileNumber') // Exclude sensitive information
            .populate('badges', 'name description icon')
            .sort({ reputation: -1, createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean();
        const total = await User_1.User.countDocuments(query);
        return res.json({
            success: true,
            data: {
                users,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit))
                }
            }
        });
    }
    catch (error) {
        console.error('Get users error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}
