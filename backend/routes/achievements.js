const express = require('express');
const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');
const User = require('../models/User');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/achievements
// @desc    Get all achievements
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, rarity, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (rarity) {
      query.rarity = rarity;
    }

    // If user is not authenticated, only show non-hidden achievements
    if (!req.user) {
      query.isHidden = false;
    }

    const achievements = await Achievement.find(query)
      .sort({ points: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Achievement.countDocuments(query);

    res.json({
      success: true,
      data: {
        achievements,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch achievements'
    });
  }
});

// @route   GET /api/achievements/:id
// @desc    Get achievement by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement || !achievement.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    // If achievement is hidden and user is not authenticated, don't show it
    if (achievement.isHidden && !req.user) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    res.json({
      success: true,
      data: { achievement }
    });
  } catch (error) {
    console.error('Get achievement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch achievement'
    });
  }
});

// @route   GET /api/achievements/user/:userId
// @desc    Get user's achievements
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, category } = req.query;
    const skip = (page - 1) * limit;

    const query = { user: userId };
    
    if (category) {
      query['achievement.category'] = category;
    }

    const userAchievements = await UserAchievement.find(query)
      .populate('achievement')
      .sort({ earnedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await UserAchievement.countDocuments({ user: userId });

    res.json({
      success: true,
      data: {
        achievements: userAchievements,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get user achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user achievements'
    });
  }
});

// @route   GET /api/achievements/my/earned
// @desc    Get current user's earned achievements
// @access  Private
router.get('/my/earned', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, category } = req.query;
    const skip = (page - 1) * limit;

    const query = { user: req.user._id };
    
    if (category) {
      query['achievement.category'] = category;
    }

    const userAchievements = await UserAchievement.find(query)
      .populate('achievement')
      .sort({ earnedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await UserAchievement.countDocuments({ user: req.user._id });

    // Calculate total points
    const totalPoints = userAchievements.reduce((sum, ua) => sum + ua.achievement.points, 0);

    res.json({
      success: true,
      data: {
        achievements: userAchievements,
        totalPoints,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get my achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your achievements'
    });
  }
});

// @route   GET /api/achievements/my/available
// @desc    Get achievements available to current user
// @access  Private
router.get('/my/available', authenticateToken, async (req, res) => {
  try {
    const { category } = req.query;

    const query = { isActive: true };
    if (category) {
      query.category = category;
    }

    const allAchievements = await Achievement.find(query);
    const earnedAchievementIds = await UserAchievement.find({ user: req.user._id })
      .distinct('achievement');

    const availableAchievements = allAchievements.filter(achievement => 
      !earnedAchievementIds.includes(achievement._id.toString())
    );

    // Check which achievements the user can earn
    const user = await User.findById(req.user._id);
    const earnableAchievements = availableAchievements.filter(achievement => 
      achievement.checkRequirements(user)
    );

    res.json({
      success: true,
      data: {
        available: earnableAchievements,
        locked: availableAchievements.filter(achievement => 
          !earnableAchievements.includes(achievement)
        )
      }
    });
  } catch (error) {
    console.error('Get available achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available achievements'
    });
  }
});

// @route   POST /api/achievements/:id/earn
// @desc    Manually earn an achievement (for manual achievements)
// @access  Private
router.post('/:id/earn', authenticateToken, async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement || !achievement.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    // Check if achievement is manual
    if (achievement.requirements.type !== 'manual') {
      return res.status(400).json({
        success: false,
        message: 'This achievement cannot be manually earned'
      });
    }

    // Check if user already has this achievement
    const existingUserAchievement = await UserAchievement.findOne({
      user: req.user._id,
      achievement: achievement._id
    });

    if (existingUserAchievement) {
      return res.status(400).json({
        success: false,
        message: 'You already have this achievement'
      });
    }

    // Create user achievement
    const userAchievement = await UserAchievement.create({
      user: req.user._id,
      achievement: achievement._id,
      earnedAt: new Date()
    });

    await userAchievement.populate('achievement');

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.achievements': 1 }
    });

    // Update achievement stats
    await Achievement.findByIdAndUpdate(achievement._id, {
      $inc: { 'stats.totalEarned': 1 },
      'stats.lastEarned': new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Achievement earned successfully',
      data: { userAchievement }
    });
  } catch (error) {
    console.error('Earn achievement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to earn achievement'
    });
  }
});

// @route   GET /api/achievements/stats/leaderboard
// @desc    Get achievement leaderboard
// @access  Public
router.get('/stats/leaderboard', async (req, res) => {
  try {
    const { limit = 10, category } = req.query;

    const matchStage = {};
    if (category) {
      matchStage['achievement.category'] = category;
    }

    const leaderboard = await UserAchievement.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'achievements',
          localField: 'achievement',
          foreignField: '_id',
          as: 'achievement'
        }
      },
      { $unwind: '$achievement' },
      {
        $group: {
          _id: '$user',
          totalPoints: { $sum: '$achievement.points' },
          achievementCount: { $sum: 1 },
          lastEarned: { $max: '$earnedAt' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          user: {
            _id: '$user._id',
            firstName: '$user.firstName',
            lastName: '$user.lastName',
            avatar: '$user.avatar'
          },
          totalPoints: 1,
          achievementCount: 1,
          lastEarned: 1
        }
      },
      { $sort: { totalPoints: -1, achievementCount: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json({
      success: true,
      data: { leaderboard }
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard'
    });
  }
});

// @route   GET /api/achievements/stats/categories
// @desc    Get achievement statistics by category
// @access  Public
router.get('/stats/categories', async (req, res) => {
  try {
    const stats = await Achievement.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalPoints: { $sum: '$points' },
          avgPoints: { $avg: '$points' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('Get category stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category statistics'
    });
  }
});

module.exports = router;
