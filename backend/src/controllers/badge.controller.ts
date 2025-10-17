import { Request, Response } from 'express';
import { BadgeService } from '../services/badgeService';
import { Badge } from '../models/Badge';
import { UserBadge } from '../models/UserBadge';

/**
 * Get all available badges (for display purposes)
 */
export async function getAllBadges(req: Request, res: Response) {
  try {
    const badges = await BadgeService.getAllBadges();

    return res.json({
      success: true,
      data: badges
    });
  } catch (error) {
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
export async function getUserBadges(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication required' 
      });
    }

    const badges = await BadgeService.getUserBadges(userId);

    return res.json({
      success: true,
      data: badges
    });
  } catch (error) {
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
export async function toggleBadgeDisplay(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const { badgeId } = req.params;
    const { isDisplayed } = req.body;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication required' 
      });
    }

    const userBadge = await UserBadge.findOneAndUpdate(
      { userId, badgeId },
      { isDisplayed },
      { new: true }
    ).populate('badgeId');

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
  } catch (error) {
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
export async function getBadgeStats(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication required' 
      });
    }

    const [
      totalBadges,
      earnedBadges,
      totalPoints,
      badgesByCategory,
      badgesByRarity
    ] = await Promise.all([
      Badge.countDocuments({ isActive: true }),
      UserBadge.countDocuments({ userId }),
      UserBadge.aggregate([
        { $match: { userId: new (require('mongoose')).Types.ObjectId(userId) } },
        { $group: { _id: null, total: { $sum: '$pointsAwarded' } } }
      ]),
      UserBadge.aggregate([
        { $match: { userId: new (require('mongoose')).Types.ObjectId(userId) } },
        { $lookup: { from: 'badges', localField: 'badgeId', foreignField: '_id', as: 'badge' } },
        { $unwind: '$badge' },
        { $group: { _id: '$badge.category', count: { $sum: 1 } } }
      ]),
      UserBadge.aggregate([
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
  } catch (error) {
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
export async function checkUserBadges(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const action = req.body.action || 'manual_check';

    const newBadges = await BadgeService.checkAndAwardBadges(userId, action);

    return res.json({
      success: true,
      data: {
        newBadges,
        count: newBadges?.length || 0
      }
    });
  } catch (error) {
    console.error('Error checking user badges:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to check user badges' 
    });
  }
}
