const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Project = require('../models/Project');
const { authenticateToken, optionalAuth, requireOwnership } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (with search and filters)
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      search,
      skills,
      experience,
      location,
      page = 1,
      limit = 20,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    const skip = (page - 1) * limit;
    const query = { isActive: true };

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by skills
    if (skills) {
      const skillArray = skills.split(',').map(skill => skill.trim());
      query['skills.name'] = { $in: skillArray };
    }

    // Filter by experience
    if (experience) {
      query.experience = experience;
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;

    const users = await User.find(query)
      .select('firstName lastName avatar bio location title company experience skills stats createdAt')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -preferences -aiProfile');

    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Increment profile views if not the user themselves
    if (!req.user || req.user._id.toString() !== user._id.toString()) {
      await User.findByIdAndUpdate(user._id, {
        $inc: { 'stats.profileViews': 1 }
      });
    }

    // Get user's projects
    const projects = await Project.find({
      $or: [
        { owner: user._id },
        { 'members.user': user._id, 'members.status': 'Active' }
      ],
      isPublic: true
    })
    .select('title description images status progress createdAt')
    .sort({ createdAt: -1 })
    .limit(6);

    res.json({
      success: true,
      data: {
        user,
        projects
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private
router.put('/:id', authenticateToken, requireOwnership(), [
  body('firstName').optional().trim().isLength({ min: 1, max: 50 }),
  body('lastName').optional().trim().isLength({ min: 1, max: 50 }),
  body('bio').optional().isLength({ max: 500 }),
  body('location').optional().isLength({ max: 100 }),
  body('website').optional().isURL(),
  body('github').optional().isLength({ max: 100 }),
  body('linkedin').optional().isLength({ max: 100 }),
  body('twitter').optional().isLength({ max: 100 }),
  body('title').optional().isLength({ max: 100 }),
  body('company').optional().isLength({ max: 100 }),
  body('experience').optional().isIn(['Student', 'Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Executive'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const allowedUpdates = [
      'firstName', 'lastName', 'bio', 'location', 'website',
      'github', 'linkedin', 'twitter', 'title', 'company', 'experience'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// @route   PUT /api/users/:id/skills
// @desc    Update user skills
// @access  Private
router.put('/:id/skills', authenticateToken, requireOwnership(), [
  body('skills').isArray().withMessage('Skills must be an array'),
  body('skills.*.name').notEmpty().withMessage('Skill name is required'),
  body('skills.*.level').isInt({ min: 1, max: 5 }).withMessage('Skill level must be between 1 and 5'),
  body('skills.*.category').isIn(['Technical', 'Design', 'Business', 'Soft Skills', 'Other'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { skills: req.body.skills },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Skills updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update skills'
    });
  }
});

// @route   PUT /api/users/:id/preferences
// @desc    Update user preferences
// @access  Private
router.put('/:id/preferences', authenticateToken, requireOwnership(), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { preferences: req.body.preferences },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update preferences'
    });
  }
});

// @route   GET /api/users/:id/projects
// @desc    Get user's projects
// @access  Public
router.get('/:id/projects', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    const query = {
      $or: [
        { owner: req.params.id },
        { 'members.user': req.params.id, 'members.status': 'Active' }
      ],
      isPublic: true
    };

    if (status) {
      query.status = status;
    }

    const projects = await Project.find(query)
      .populate('owner', 'firstName lastName avatar')
      .populate('members.user', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Project.countDocuments(query);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get user projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user projects'
    });
  }
});

// @route   GET /api/users/:id/connections
// @desc    Get user's connections
// @access  Private
router.get('/:id/connections', authenticateToken, async (req, res) => {
  try {
    // In a real app, you'd have a separate Connection model
    // For now, we'll return a placeholder
    res.json({
      success: true,
      data: {
        connections: [],
        message: 'Connections feature coming soon'
      }
    });
  } catch (error) {
    console.error('Get connections error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch connections'
    });
  }
});

// @route   POST /api/users/:id/connect
// @desc    Send connection request
// @access  Private
router.post('/:id/connect', authenticateToken, async (req, res) => {
  try {
    const targetUserId = req.params.id;
    
    if (req.user._id.toString() === targetUserId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot connect to yourself'
      });
    }

    // In a real app, you'd create a connection request
    res.json({
      success: true,
      message: 'Connection request sent'
    });
  } catch (error) {
    console.error('Send connection request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send connection request'
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user account
// @access  Private
router.delete('/:id', authenticateToken, requireOwnership(), async (req, res) => {
  try {
    // Soft delete - deactivate account
    await User.findByIdAndUpdate(req.params.id, {
      isActive: false,
      email: `deleted_${Date.now()}_${req.user.email}`
    });

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account'
    });
  }
});

module.exports = router;
