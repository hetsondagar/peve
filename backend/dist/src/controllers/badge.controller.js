"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBadges = getAllBadges;
exports.getUserBadges = getUserBadges;
exports.toggleBadgeDisplay = toggleBadgeDisplay;
exports.getBadgeStats = getBadgeStats;
exports.checkUserBadges = checkUserBadges;
const badgeService_1 = require("../services/badgeService");
const Badge_1 = require("../models/Badge");
const UserBadge_1 = require("../models/UserBadge");
/**
 * Get all available badges (for display purposes)
 */
async function getAllBadges(req, res) {
    try {
        const badges = await badgeService_1.BadgeService.getAllBadges();
        return res.json({
            success: true,
            data: badges
        });
    }
    catch (error) {
        console.error('Error fetching all badges:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch badges'
        });
    }
}
/**
 * Get user's earned badges
 */
async function getUserBadges(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }
        const badges = await badgeService_1.BadgeService.getUserBadges(userId);
        return res.json({
            success: true,
            data: badges
        });
    }
    catch (error) {
        console.error('Error fetching user badges:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user badges'
        });
    }
}
/**
 * Toggle badge display status
 */
async function toggleBadgeDisplay(req, res) {
    try {
        const userId = req.user?.id;
        const { badgeId } = req.params;
        const { isDisplayed } = req.body;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }
        const userBadge = await UserBadge_1.UserBadge.findOneAndUpdate({ userId, badgeId }, { isDisplayed }, { new: true }).populate('badgeId');
        if (!userBadge) {
            return res.status(404).json({
                success: false,
                error: 'Badge not found'
            });
        }
        return res.json({
            success: true,
            data: userBadge
        });
    }
    catch (error) {
        console.error('Error toggling badge display:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to toggle badge display'
        });
    }
}
/**
 * Get badge statistics
 */
async function getBadgeStats(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }
        const [totalBadges, earnedBadges, totalPoints, badgesByCategory, badgesByRarity] = await Promise.all([
            Badge_1.Badge.countDocuments({ isActive: true }),
            UserBadge_1.UserBadge.countDocuments({ userId }),
            UserBadge_1.UserBadge.aggregate([
                { $match: { userId: new (require('mongoose')).Types.ObjectId(userId) } },
                { $group: { _id: null, total: { $sum: '$pointsAwarded' } } }
            ]),
            UserBadge_1.UserBadge.aggregate([
                { $match: { userId: new (require('mongoose')).Types.ObjectId(userId) } },
                { $lookup: { from: 'badges', localField: 'badgeId', foreignField: '_id', as: 'badge' } },
                { $unwind: '$badge' },
                { $group: { _id: '$badge.category', count: { $sum: 1 } } }
            ]),
            UserBadge_1.UserBadge.aggregate([
                { $match: { userId: new (require('mongoose')).Types.ObjectId(userId) } },
                { $lookup: { from: 'badges', localField: 'badgeId', foreignField: '_id', as: 'badge' } },
                { $unwind: '$badge' },
                { $group: { _id: '$badge.rarity', count: { $sum: 1 } } }
            ])
        ]);
        return res.json({
            success: true,
            data: {
                totalBadges,
                earnedBadges,
                totalPoints: totalPoints[0]?.total || 0,
                badgesByCategory,
                badgesByRarity,
                completionPercentage: Math.round((earnedBadges / totalBadges) * 100)
            }
        });
    }
    catch (error) {
        console.error('Error fetching badge stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch badge stats'
        });
    }
}
/**
 * Manually trigger badge check for a user (admin only)
 */
async function checkUserBadges(req, res) {
    try {
        const { userId } = req.params;
        const action = req.body.action || 'manual_check';
        const newBadges = await badgeService_1.BadgeService.checkAndAwardBadges(userId, action);
        return res.json({
            success: true,
            data: {
                newBadges,
                count: newBadges?.length || 0
            }
        });
    }
    catch (error) {
        console.error('Error checking user badges:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to check user badges'
        });
    }
}
