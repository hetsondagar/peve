"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchAll = searchAll;
exports.searchProjects = searchProjects;
exports.searchIdeas = searchIdeas;
exports.searchUsers = searchUsers;
const Project_1 = require("../models/Project");
const Idea_1 = require("../models/Idea");
const User_1 = require("../models/User");
async function searchAll(req, res) {
    try {
        const { q, type, page = 1, limit = 10 } = req.query;
        if (!q || typeof q !== 'string' || q.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Search query is required'
            });
        }
        const searchQuery = q.trim();
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const skip = (pageNum - 1) * limitNum;
        let results = {
            projects: [],
            ideas: [],
            users: [],
            total: 0
        };
        // Search projects
        if (!type || type === 'all' || type === 'projects') {
            const projectQuery = {
                $or: [
                    { title: { $regex: searchQuery, $options: 'i' } },
                    { description: { $regex: searchQuery, $options: 'i' } },
                    { tags: { $in: [new RegExp(searchQuery, 'i')] } },
                    { techStack: { $in: [new RegExp(searchQuery, 'i')] } }
                ]
            };
            const projects = await Project_1.Project.find(projectQuery)
                .populate('author', 'username name')
                .select('title description tags techStack author createdAt')
                .sort({ createdAt: -1 })
                .limit(limitNum)
                .skip(skip);
            results.projects = projects;
        }
        // Search ideas
        if (!type || type === 'all' || type === 'ideas') {
            const ideaQuery = {
                $or: [
                    { title: { $regex: searchQuery, $options: 'i' } },
                    { description: { $regex: searchQuery, $options: 'i' } },
                    { tags: { $in: [new RegExp(searchQuery, 'i')] } },
                    { category: { $regex: searchQuery, $options: 'i' } }
                ]
            };
            const ideas = await Idea_1.Idea.find(ideaQuery)
                .populate('author', 'username name')
                .select('title description tags category author createdAt')
                .sort({ createdAt: -1 })
                .limit(limitNum)
                .skip(skip);
            results.ideas = ideas;
        }
        // Search users
        if (!type || type === 'all' || type === 'users') {
            const userQuery = {
                $or: [
                    { username: { $regex: searchQuery, $options: 'i' } },
                    { name: { $regex: searchQuery, $options: 'i' } },
                    { bio: { $regex: searchQuery, $options: 'i' } },
                    { skills: { $in: [new RegExp(searchQuery, 'i')] } },
                    { interests: { $in: [new RegExp(searchQuery, 'i')] } }
                ]
            };
            const users = await User_1.User.find(userQuery)
                .select('-passwordHash -email')
                .sort({ createdAt: -1 })
                .limit(limitNum)
                .skip(skip);
            results.users = users;
        }
        // Calculate total results
        const totalProjects = await Project_1.Project.countDocuments({
            $or: [
                { title: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } },
                { tags: { $in: [new RegExp(searchQuery, 'i')] } },
                { techStack: { $in: [new RegExp(searchQuery, 'i')] } }
            ]
        });
        const totalIdeas = await Idea_1.Idea.countDocuments({
            $or: [
                { title: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } },
                { tags: { $in: [new RegExp(searchQuery, 'i')] } },
                { category: { $regex: searchQuery, $options: 'i' } }
            ]
        });
        const totalUsers = await User_1.User.countDocuments({
            $or: [
                { username: { $regex: searchQuery, $options: 'i' } },
                { name: { $regex: searchQuery, $options: 'i' } },
                { bio: { $regex: searchQuery, $options: 'i' } },
                { skills: { $in: [new RegExp(searchQuery, 'i')] } },
                { interests: { $in: [new RegExp(searchQuery, 'i')] } }
            ]
        });
        results.total = totalProjects + totalIdeas + totalUsers;
        return res.json({
            success: true,
            data: {
                results,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total: results.total,
                    totalPages: Math.ceil(results.total / limitNum)
                },
                query: searchQuery
            }
        });
    }
    catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}
async function searchProjects(req, res) {
    try {
        const { q, page = 1, limit = 10 } = req.query;
        if (!q || typeof q !== 'string' || q.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Search query is required'
            });
        }
        const searchQuery = q.trim();
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const skip = (pageNum - 1) * limitNum;
        const query = {
            $or: [
                { title: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } },
                { tags: { $in: [new RegExp(searchQuery, 'i')] } },
                { techStack: { $in: [new RegExp(searchQuery, 'i')] } }
            ]
        };
        const projects = await Project_1.Project.find(query)
            .populate('author', 'username name')
            .select('title description tags techStack author createdAt')
            .sort({ createdAt: -1 })
            .limit(limitNum)
            .skip(skip);
        const total = await Project_1.Project.countDocuments(query);
        return res.json({
            success: true,
            data: {
                projects,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    totalPages: Math.ceil(total / limitNum)
                },
                query: searchQuery
            }
        });
    }
    catch (error) {
        console.error('Project search error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}
async function searchIdeas(req, res) {
    try {
        const { q, page = 1, limit = 10 } = req.query;
        if (!q || typeof q !== 'string' || q.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Search query is required'
            });
        }
        const searchQuery = q.trim();
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const skip = (pageNum - 1) * limitNum;
        const query = {
            $or: [
                { title: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } },
                { tags: { $in: [new RegExp(searchQuery, 'i')] } },
                { category: { $regex: searchQuery, $options: 'i' } }
            ]
        };
        const ideas = await Idea_1.Idea.find(query)
            .populate('author', 'username name')
            .select('title description tags category author createdAt')
            .sort({ createdAt: -1 })
            .limit(limitNum)
            .skip(skip);
        const total = await Idea_1.Idea.countDocuments(query);
        return res.json({
            success: true,
            data: {
                ideas,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    totalPages: Math.ceil(total / limitNum)
                },
                query: searchQuery
            }
        });
    }
    catch (error) {
        console.error('Idea search error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}
async function searchUsers(req, res) {
    try {
        const { q, page = 1, limit = 10 } = req.query;
        if (!q || typeof q !== 'string' || q.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Search query is required'
            });
        }
        const searchQuery = q.trim();
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const skip = (pageNum - 1) * limitNum;
        const query = {
            $or: [
                { username: { $regex: searchQuery, $options: 'i' } },
                { name: { $regex: searchQuery, $options: 'i' } },
                { bio: { $regex: searchQuery, $options: 'i' } },
                { skills: { $in: [new RegExp(searchQuery, 'i')] } },
                { interests: { $in: [new RegExp(searchQuery, 'i')] } }
            ]
        };
        const users = await User_1.User.find(query)
            .select('-passwordHash -email')
            .sort({ createdAt: -1 })
            .limit(limitNum)
            .skip(skip);
        const total = await User_1.User.countDocuments(query);
        return res.json({
            success: true,
            data: {
                users,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    totalPages: Math.ceil(total / limitNum)
                },
                query: searchQuery
            }
        });
    }
    catch (error) {
        console.error('User search error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}
