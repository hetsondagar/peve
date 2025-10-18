"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleLike = toggleLike;
exports.toggleSave = toggleSave;
exports.getUserLikes = getUserLikes;
exports.getUserSaves = getUserSaves;
exports.getInteractionStatus = getInteractionStatus;
const Like_1 = require("../models/Like");
const Save_1 = require("../models/Save");
const Project_1 = require("../models/Project");
const Idea_1 = require("../models/Idea");
const Comment_1 = require("../models/Comment");
const Prompt_1 = require("../models/Prompt");
const badgeService_1 = require("../services/badgeService");
// Like/Unlike functionality
async function toggleLike(req, res) {
    try {
        const userId = req.user?.id;
        const { targetType, targetId } = req.params;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }
        const normalizedTargetType = targetType.toLowerCase();
        if (!['project', 'idea', 'comment', 'prompt'].includes(normalizedTargetType)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid target type'
            });
        }
        // Check if target exists
        let target;
        switch (normalizedTargetType) {
            case 'project':
                target = await Project_1.Project.findById(targetId);
                break;
            case 'idea':
                target = await Idea_1.Idea.findById(targetId);
                break;
            case 'comment':
                target = await Comment_1.Comment.findById(targetId);
                break;
            case 'prompt':
                target = await Prompt_1.Prompt.findById(targetId);
                break;
        }
        if (!target) {
            return res.status(404).json({
                success: false,
                error: 'Target not found'
            });
        }
        // Check if user already liked
        const existingLike = await Like_1.Like.findOne({
            userId,
            targetType: normalizedTargetType,
            targetId
        });
        let isLiked;
        let likeCount = 0;
        if (existingLike) {
            // Unlike
            await Like_1.Like.findByIdAndDelete(existingLike._id);
            isLiked = false;
            // Decrement like count on target
            switch (normalizedTargetType) {
                case 'project':
                    await Project_1.Project.findByIdAndUpdate(targetId, { $inc: { 'metrics.likes': -1 } });
                    const updatedProject = await Project_1.Project.findById(targetId);
                    likeCount = updatedProject?.metrics?.likes || 0;
                    break;
                case 'idea':
                    await Idea_1.Idea.findByIdAndUpdate(targetId, { $inc: { likes: -1 } });
                    const updatedIdea = await Idea_1.Idea.findById(targetId);
                    likeCount = updatedIdea?.likes || 0;
                    break;
                case 'comment':
                    await Comment_1.Comment.findByIdAndUpdate(targetId, { $inc: { likes: -1 } });
                    const updatedComment = await Comment_1.Comment.findById(targetId);
                    likeCount = updatedComment?.likes || 0;
                    break;
                case 'prompt':
                    // Prompts don't have like counts in the current schema
                    likeCount = await Like_1.Like.countDocuments({ targetType: normalizedTargetType, targetId });
                    break;
            }
        }
        else {
            // Like
            await Like_1.Like.create({ userId, targetType: normalizedTargetType, targetId });
            isLiked = true;
            // Increment like count on target
            switch (normalizedTargetType) {
                case 'project':
                    await Project_1.Project.findByIdAndUpdate(targetId, { $inc: { 'metrics.likes': 1 } });
                    const updatedProject = await Project_1.Project.findById(targetId);
                    likeCount = updatedProject?.metrics?.likes || 0;
                    break;
                case 'idea':
                    await Idea_1.Idea.findByIdAndUpdate(targetId, { $inc: { likes: 1 } });
                    const updatedIdea = await Idea_1.Idea.findById(targetId);
                    likeCount = updatedIdea?.likes || 0;
                    break;
                case 'comment':
                    await Comment_1.Comment.findByIdAndUpdate(targetId, { $inc: { likes: 1 } });
                    const updatedComment = await Comment_1.Comment.findById(targetId);
                    likeCount = updatedComment?.likes || 0;
                    break;
                case 'prompt':
                    // Prompts don't have like counts in the current schema
                    likeCount = await Like_1.Like.countDocuments({ targetType: normalizedTargetType, targetId });
                    break;
            }
        }
        // Check for badge awards (only when liking, not unliking)
        if (isLiked) {
            try {
                await badgeService_1.BadgeService.checkAndAwardBadges(userId, 'item_liked', targetId);
            }
            catch (badgeError) {
                console.error('Error checking badges for like:', badgeError);
            }
        }
        return res.json({
            success: true,
            data: {
                isLiked,
                likeCount
            }
        });
    }
    catch (error) {
        console.error('Toggle like error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to toggle like'
        });
    }
}
// Save/Unsave functionality
async function toggleSave(req, res) {
    try {
        const userId = req.user?.id;
        const { targetType, targetId } = req.params;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }
        const normalizedTargetType = targetType.toLowerCase();
        if (!['project', 'idea', 'comment', 'prompt'].includes(normalizedTargetType)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid target type'
            });
        }
        // Check if target exists
        let target;
        switch (normalizedTargetType) {
            case 'project':
                target = await Project_1.Project.findById(targetId);
                break;
            case 'idea':
                target = await Idea_1.Idea.findById(targetId);
                break;
            case 'comment':
                target = await Comment_1.Comment.findById(targetId);
                break;
            case 'prompt':
                target = await Prompt_1.Prompt.findById(targetId);
                break;
        }
        if (!target) {
            return res.status(404).json({
                success: false,
                error: 'Target not found'
            });
        }
        // Check if user already saved
        const existingSave = await Save_1.Save.findOne({
            userId,
            targetType: normalizedTargetType,
            targetId
        });
        let isSaved;
        let saveCount = 0;
        if (existingSave) {
            // Unsave
            await Save_1.Save.findByIdAndDelete(existingSave._id);
            isSaved = false;
            // Decrement save count on target
            switch (normalizedTargetType) {
                case 'project':
                    await Project_1.Project.findByIdAndUpdate(targetId, { $inc: { 'metrics.saves': -1 } });
                    const updatedProject = await Project_1.Project.findById(targetId);
                    saveCount = updatedProject?.metrics?.saves || 0;
                    break;
                case 'idea':
                    await Idea_1.Idea.findByIdAndUpdate(targetId, { $inc: { saveCount: -1 } });
                    const updatedIdea = await Idea_1.Idea.findById(targetId);
                    saveCount = updatedIdea?.saveCount || 0;
                    break;
                case 'comment':
                    await Comment_1.Comment.findByIdAndUpdate(targetId, { $inc: { saveCount: -1 } });
                    const updatedComment = await Comment_1.Comment.findById(targetId);
                    saveCount = updatedComment?.saveCount || 0;
                    break;
                case 'prompt':
                    await Prompt_1.Prompt.findByIdAndUpdate(targetId, { $inc: { saveCount: -1 } });
                    const updatedPrompt = await Prompt_1.Prompt.findById(targetId);
                    saveCount = updatedPrompt?.saveCount || 0;
                    break;
            }
        }
        else {
            // Save
            await Save_1.Save.create({ userId, targetType: normalizedTargetType, targetId });
            isSaved = true;
            // Increment save count on target
            switch (normalizedTargetType) {
                case 'project':
                    await Project_1.Project.findByIdAndUpdate(targetId, { $inc: { 'metrics.saves': 1 } });
                    const updatedProject = await Project_1.Project.findById(targetId);
                    saveCount = updatedProject?.metrics?.saves || 0;
                    break;
                case 'idea':
                    await Idea_1.Idea.findByIdAndUpdate(targetId, { $inc: { saveCount: 1 } });
                    const updatedIdea = await Idea_1.Idea.findById(targetId);
                    saveCount = updatedIdea?.saveCount || 0;
                    break;
                case 'comment':
                    await Comment_1.Comment.findByIdAndUpdate(targetId, { $inc: { saveCount: 1 } });
                    const updatedComment = await Comment_1.Comment.findById(targetId);
                    saveCount = updatedComment?.saveCount || 0;
                    break;
                case 'prompt':
                    await Prompt_1.Prompt.findByIdAndUpdate(targetId, { $inc: { saveCount: 1 } });
                    const updatedPrompt = await Prompt_1.Prompt.findById(targetId);
                    saveCount = updatedPrompt?.saveCount || 0;
                    break;
            }
        }
        // Check for badge awards (only when saving, not unsaving)
        if (isSaved) {
            try {
                await badgeService_1.BadgeService.checkAndAwardBadges(userId, 'item_saved', targetId);
            }
            catch (badgeError) {
                console.error('Error checking badges for save:', badgeError);
            }
        }
        return res.json({
            success: true,
            data: {
                isSaved,
                saveCount
            }
        });
    }
    catch (error) {
        console.error('Toggle save error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to toggle save'
        });
    }
}
// Get user's liked items
async function getUserLikes(req, res) {
    try {
        const userId = req.user?.id;
        const { targetType } = req.query;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }
        const query = { userId };
        if (targetType) {
            query.targetType = targetType;
        }
        const likes = await Like_1.Like.find(query)
            .sort({ createdAt: -1 })
            .lean();
        // Manually populate targetId based on targetType
        const populatedLikes = await Promise.all(likes.map(async (like) => {
            let targetData = null;
            try {
                switch (like.targetType) {
                    case 'project':
                        targetData = await Project_1.Project.findById(like.targetId);
                        break;
                    case 'idea':
                        targetData = await Idea_1.Idea.findById(like.targetId);
                        break;
                    case 'comment':
                        targetData = await Comment_1.Comment.findById(like.targetId);
                        break;
                    case 'prompt':
                        targetData = await Prompt_1.Prompt.findById(like.targetId);
                        break;
                }
            }
            catch (error) {
                console.error(`Error populating ${like.targetType}:`, error);
            }
            return {
                ...like,
                targetId: targetData
            };
        }));
        return res.json({
            success: true,
            data: populatedLikes
        });
    }
    catch (error) {
        console.error('Get user likes error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch likes'
        });
    }
}
// Get user's saved items
async function getUserSaves(req, res) {
    try {
        const userId = req.user?.id;
        const { targetType } = req.query;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }
        const query = { userId };
        if (targetType) {
            query.targetType = targetType;
        }
        const saves = await Save_1.Save.find(query)
            .sort({ createdAt: -1 })
            .lean();
        // Manually populate targetId based on targetType
        const populatedSaves = await Promise.all(saves.map(async (save) => {
            let targetData = null;
            try {
                switch (save.targetType) {
                    case 'project':
                        targetData = await Project_1.Project.findById(save.targetId);
                        break;
                    case 'idea':
                        targetData = await Idea_1.Idea.findById(save.targetId);
                        break;
                    case 'comment':
                        targetData = await Comment_1.Comment.findById(save.targetId);
                        break;
                    case 'prompt':
                        targetData = await Prompt_1.Prompt.findById(save.targetId);
                        break;
                }
            }
            catch (error) {
                console.error(`Error populating ${save.targetType}:`, error);
            }
            return {
                ...save,
                targetId: targetData
            };
        }));
        return res.json({
            success: true,
            data: populatedSaves
        });
    }
    catch (error) {
        console.error('Get user saves error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch saves'
        });
    }
}
// Get interaction status for multiple items
async function getInteractionStatus(req, res) {
    try {
        const userId = req.user?.id;
        const { items } = req.body; // Array of { targetType, targetId }
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }
        if (!Array.isArray(items)) {
            return res.status(400).json({
                success: false,
                error: 'Items must be an array'
            });
        }
        const statuses = await Promise.all(items.map(async (item) => {
            const [like, save] = await Promise.all([
                Like_1.Like.findOne({ userId, targetType: item.targetType.toLowerCase(), targetId: item.targetId }),
                Save_1.Save.findOne({ userId, targetType: item.targetType.toLowerCase(), targetId: item.targetId })
            ]);
            return {
                targetType: item.targetType,
                targetId: item.targetId,
                isLiked: !!like,
                isSaved: !!save
            };
        }));
        return res.json({
            success: true,
            data: statuses
        });
    }
    catch (error) {
        console.error('Get interaction status error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch interaction status'
        });
    }
}
