"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTodaysPrompt = getTodaysPrompt;
exports.voteOnPrompt = voteOnPrompt;
exports.getAllPrompts = getAllPrompts;
exports.createPrompt = createPrompt;
exports.seedPrompts = seedPrompts;
const Prompt_1 = require("../models/Prompt");
const Vote_1 = require("../models/Vote");
const Comment_1 = require("../models/Comment");
const badgeService_1 = require("../services/badgeService");
// Get today's prompt (same prompt for all users on the same day)
async function getTodaysPrompt(req, res) {
    try {
        // Try to get user ID from token if available
        let userId = null;
        try {
            const header = req.headers.authorization || '';
            const token = header.startsWith('Bearer ') ? header.slice(7) : undefined;
            if (token) {
                const { verifyAccessToken } = await Promise.resolve().then(() => __importStar(require('../utils/jwt')));
                const payload = verifyAccessToken(token);
                userId = payload.sub || payload.id;
            }
        }
        catch (authError) {
            // User not authenticated or invalid token, continue without userId
            console.log('User not authenticated for prompt fetch');
        }
        // Get today's date as a seed for consistent daily prompts
        const today = new Date();
        const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD format
        // Use date as seed for consistent daily selection
        const seed = dateString.split('-').join('');
        const seedNumber = parseInt(seed) % 1000000; // Convert to manageable number
        // Get total count of active prompts
        const totalPrompts = await Prompt_1.Prompt.countDocuments({ isActive: true });
        if (totalPrompts === 0) {
            return res.status(404).json({
                success: false,
                error: 'No prompts available'
            });
        }
        // Calculate today's prompt index using seed
        const todaysIndex = seedNumber % totalPrompts;
        // Get today's prompt
        const prompt = await Prompt_1.Prompt.findOne({ isActive: true })
            .skip(todaysIndex)
            .lean();
        if (!prompt) {
            return res.status(404).json({
                success: false,
                error: 'Prompt not found'
            });
        }
        // Get vote counts for this prompt
        const voteCounts = await Vote_1.Vote.aggregate([
            { $match: { promptId: prompt._id } },
            { $group: { _id: '$voteType', count: { $sum: 1 } } }
        ]);
        // Get user's vote if authenticated
        let userVote = null;
        if (userId) {
            userVote = await Vote_1.Vote.findOne({
                userId,
                promptId: prompt._id
            }).lean();
        }
        // Get recent comments
        const comments = await Comment_1.Comment.find({
            targetType: 'prompt',
            targetId: prompt._id,
            parentComment: { $exists: false } // Only top-level comments
        })
            .populate('author', 'username name avatarUrl avatarStyle')
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();
        // Add replies count to each comment
        const commentsWithRepliesCount = await Promise.all(comments.map(async (comment) => {
            const repliesCount = await Comment_1.Comment.countDocuments({
                parentComment: comment._id
            });
            return {
                ...comment,
                repliesCount
            };
        }));
        // Format vote counts
        const votes = {
            agree: 0,
            disagree: 0,
            yes: 0,
            no: 0,
            total: 0
        };
        voteCounts.forEach(vote => {
            votes[vote._id] = vote.count;
            votes.total += vote.count;
        });
        return res.json({
            success: true,
            data: {
                prompt,
                votes,
                userVote,
                comments: commentsWithRepliesCount,
                date: dateString
            }
        });
    }
    catch (error) {
        console.error('Get today\'s prompt error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch today\'s prompt'
        });
    }
}
// Vote on a prompt
async function voteOnPrompt(req, res) {
    try {
        const userId = req.user?.id;
        const { promptId } = req.params;
        const { voteType, optionValue } = req.body;
        console.log('Vote request:', { userId, promptId, voteType, optionValue });
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }
        if (!voteType || !['agree', 'disagree', 'yes', 'no', 'option'].includes(voteType)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid vote type'
            });
        }
        // Check if prompt exists
        const prompt = await Prompt_1.Prompt.findById(promptId);
        if (!prompt) {
            return res.status(404).json({
                success: false,
                error: 'Prompt not found'
            });
        }
        // Remove existing vote if any
        await Vote_1.Vote.findOneAndDelete({ userId, promptId });
        // Create new vote
        const vote = await Vote_1.Vote.create({
            userId,
            promptId,
            voteType,
            optionValue
        });
        console.log('Vote created:', vote);
        // Get updated vote counts
        const voteCounts = await Vote_1.Vote.aggregate([
            { $match: { promptId } },
            { $group: { _id: '$voteType', count: { $sum: 1 } } }
        ]);
        console.log('Vote counts:', voteCounts);
        const votes = {
            agree: 0,
            disagree: 0,
            yes: 0,
            no: 0,
            total: 0
        };
        voteCounts.forEach(vote => {
            votes[vote._id] = vote.count;
            votes.total += vote.count;
        });
        // Check for badge awards
        try {
            await badgeService_1.BadgeService.checkAndAwardBadges(userId, 'prompt_voted', promptId);
        }
        catch (badgeError) {
            console.error('Error checking badges for prompt vote:', badgeError);
        }
        return res.json({
            success: true,
            data: {
                vote,
                votes
            }
        });
    }
    catch (error) {
        console.error('Vote on prompt error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to vote on prompt'
        });
    }
}
// Get all prompts (for admin or browsing)
async function getAllPrompts(req, res) {
    try {
        const { page = '1', limit = '20', category, type } = req.query;
        const query = { isActive: true };
        if (category)
            query.category = category;
        if (type)
            query.type = type;
        const prompts = await Prompt_1.Prompt.find(query)
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .lean();
        const total = await Prompt_1.Prompt.countDocuments(query);
        return res.json({
            success: true,
            data: {
                prompts,
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Get all prompts error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch prompts'
        });
    }
}
// Create a new prompt (admin only)
async function createPrompt(req, res) {
    try {
        const { question, type, category, options, tags } = req.body;
        if (!question || !type || !category) {
            return res.status(400).json({
                success: false,
                error: 'Question, type, and category are required'
            });
        }
        const prompt = await Prompt_1.Prompt.create({
            question,
            type,
            category,
            options,
            tags: tags || []
        });
        return res.status(201).json({
            success: true,
            data: prompt
        });
    }
    catch (error) {
        console.error('Create prompt error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create prompt'
        });
    }
}
async function seedPrompts(req, res) {
    try {
        // Check if prompts already exist
        const existingPrompts = await Prompt_1.Prompt.countDocuments();
        if (existingPrompts > 0) {
            return res.json({
                success: true,
                message: 'Prompts already exist',
                count: existingPrompts
            });
        }
        const samplePrompts = [
            {
                question: "Should AI replace human developers in the next 10 years?",
                type: "debate",
                category: "tech",
                tags: ["AI", "development", "future"]
            },
            {
                question: "What's the most important skill for a developer in 2024?",
                type: "poll",
                category: "tech",
                options: ["Problem Solving", "Communication", "Learning Agility", "Technical Skills"],
                tags: ["skills", "development", "career"]
            },
            {
                question: "If you could only use one programming language for the rest of your career, which would it be?",
                type: "open",
                category: "tech",
                tags: ["programming", "languages", "career"]
            },
            {
                question: "Is remote work better for software development teams?",
                type: "debate",
                category: "community",
                tags: ["remote work", "team", "productivity"]
            },
            {
                question: "What's the biggest challenge facing the tech industry today?",
                type: "open",
                category: "future",
                tags: ["challenges", "industry", "technology"]
            }
        ];
        const createdPrompts = await Prompt_1.Prompt.insertMany(samplePrompts);
        return res.json({
            success: true,
            message: 'Sample prompts created successfully',
            data: createdPrompts
        });
    }
    catch (error) {
        console.error('Seed prompts error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to seed prompts'
        });
    }
}
