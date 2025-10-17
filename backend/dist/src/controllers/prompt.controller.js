"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTodaysPrompt = getTodaysPrompt;
exports.voteOnPrompt = voteOnPrompt;
exports.getAllPrompts = getAllPrompts;
exports.createPrompt = createPrompt;
const Prompt_1 = require("../models/Prompt");
const Vote_1 = require("../models/Vote");
const Comment_1 = require("../models/Comment");
// Get today's prompt (same prompt for all users on the same day)
async function getTodaysPrompt(req, res) {
    try {
        const userId = req.user?.id;
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
            parentType: 'Prompt',
            parentId: prompt._id
        })
            .populate('author', 'username name avatarUrl')
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();
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
                comments,
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
        // Get updated vote counts
        const voteCounts = await Vote_1.Vote.aggregate([
            { $match: { promptId } },
            { $group: { _id: '$voteType', count: { $sum: 1 } } }
        ]);
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
