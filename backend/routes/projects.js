const express = require('express');
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const User = require('../models/User');
const { authenticateToken, optionalAuth, canAccessResource } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects (with search and filters)
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      search,
      category,
      status,
      technologies,
      collaborationType,
      page = 1,
      limit = 20,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    const skip = (page - 1) * limit;
    const query = { isPublic: true };

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by technologies
    if (technologies) {
      const techArray = technologies.split(',').map(tech => tech.trim());
      query.technologies = { $in: techArray };
    }

    // Filter by collaboration type
    if (collaborationType) {
      query.collaborationType = collaborationType;
    }

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;

    const projects = await Project.find(query)
      .populate('owner', 'firstName lastName avatar title company')
      .populate('members.user', 'firstName lastName avatar')
      .sort(sortObj)
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
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects'
    });
  }
});

// @route   GET /api/projects/featured
// @desc    Get featured projects
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const projects = await Project.find({
      isPublic: true,
      isFeatured: true,
      status: { $in: ['Planning', 'In Progress'] }
    })
    .populate('owner', 'firstName lastName avatar title company')
    .populate('members.user', 'firstName lastName avatar')
    .sort({ createdAt: -1 })
    .limit(6);

    res.json({
      success: true,
      data: { projects }
    });
  } catch (error) {
    console.error('Get featured projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured projects'
    });
  }
});

// @route   GET /api/projects/:id
// @desc    Get project by ID
// @access  Public
router.get('/:id', optionalAuth, canAccessResource('project'), async (req, res) => {
  try {
    const project = req.resource;

    // Increment views if not the owner
    if (!req.user || req.user._id.toString() !== project.owner.toString()) {
      await Project.findByIdAndUpdate(project._id, {
        $inc: { views: 1 }
      });
    }

    res.json({
      success: true,
      data: { project }
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project'
    });
  }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private
router.post('/', authenticateToken, [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required and must be less than 100 characters'),
  body('description').isLength({ min: 1, max: 2000 }).withMessage('Description is required and must be less than 2000 characters'),
  body('category').isIn(['Web Development', 'Mobile App', 'AI/ML', 'Data Science', 'Design', 'DevOps', 'Blockchain', 'Game Development', 'Other']),
  body('technologies').optional().isArray(),
  body('tags').optional().isArray(),
  body('collaborationType').isIn(['Open', 'Invite Only', 'Closed']),
  body('maxMembers').optional().isInt({ min: 1, max: 50 })
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

    const projectData = {
      ...req.body,
      owner: req.user._id
    };

    const project = await Project.create(projectData);

    // Add owner as first member
    await project.addMember(req.user._id, 'Owner');

    // Populate the project with owner details
    await project.populate('owner', 'firstName lastName avatar title company');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: { project }
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create project'
    });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private
router.put('/:id', authenticateToken, canAccessResource('project'), [
  body('title').optional().trim().isLength({ min: 1, max: 100 }),
  body('description').optional().isLength({ min: 1, max: 2000 }),
  body('status').optional().isIn(['Planning', 'In Progress', 'Completed', 'On Hold', 'Cancelled']),
  body('progress').optional().isInt({ min: 0, max: 100 })
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

    const project = req.resource;

    // Check if user is owner or has permission to edit
    const isOwner = project.owner.toString() === req.user._id.toString();
    const isMember = project.members.some(member => 
      member.user.toString() === req.user._id.toString() && 
      member.status === 'Active' && 
      ['Owner', 'Lead'].includes(member.role)
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to edit this project'
      });
    }

    const allowedUpdates = [
      'title', 'description', 'shortDescription', 'category', 'tags', 'technologies',
      'images', 'demoUrl', 'githubUrl', 'status', 'progress', 'endDate',
      'collaborationType', 'requiredSkills', 'maxMembers', 'isPublic'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const updatedProject = await Project.findByIdAndUpdate(
      project._id,
      updates,
      { new: true, runValidators: true }
    ).populate('owner', 'firstName lastName avatar title company')
     .populate('members.user', 'firstName lastName avatar');

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: { project: updatedProject }
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project'
    });
  }
});

// @route   POST /api/projects/:id/apply
// @desc    Apply to join project
// @access  Private
router.post('/:id/apply', authenticateToken, canAccessResource('project'), [
  body('message').optional().isLength({ max: 500 })
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

    const project = req.resource;

    // Check if user is already a member
    const isMember = project.members.some(member => 
      member.user.toString() === req.user._id.toString() && member.status === 'Active'
    );

    if (isMember) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this project'
      });
    }

    // Check if user has already applied
    const hasApplied = project.applications.some(app => 
      app.user.toString() === req.user._id.toString() && app.status === 'Pending'
    );

    if (hasApplied) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this project'
      });
    }

    await project.applyToProject(req.user._id, req.body.message);

    res.json({
      success: true,
      message: 'Application submitted successfully'
    });
  } catch (error) {
    console.error('Apply to project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application'
    });
  }
});

// @route   POST /api/projects/:id/like
// @desc    Like/unlike project
// @access  Private
router.post('/:id/like', authenticateToken, canAccessResource('project'), async (req, res) => {
  try {
    const project = req.resource;
    const hasLiked = project.likes.some(like => 
      like.user.toString() === req.user._id.toString()
    );

    if (hasLiked) {
      await project.unlikeProject(req.user._id);
      res.json({
        success: true,
        message: 'Project unliked',
        data: { liked: false }
      });
    } else {
      await project.likeProject(req.user._id);
      res.json({
        success: true,
        message: 'Project liked',
        data: { liked: true }
      });
    }
  } catch (error) {
    console.error('Like project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update like status'
    });
  }
});

// @route   POST /api/projects/:id/members/:userId
// @desc    Add member to project
// @access  Private
router.post('/:id/members/:userId', authenticateToken, canAccessResource('project'), async (req, res) => {
  try {
    const project = req.resource;
    const { userId } = req.params;
    const { role = 'Contributor' } = req.body;

    // Check if user is owner or lead
    const isOwner = project.owner.toString() === req.user._id.toString();
    const isLead = project.members.some(member => 
      member.user.toString() === req.user._id.toString() && 
      member.status === 'Active' && 
      ['Owner', 'Lead'].includes(member.role)
    );

    if (!isOwner && !isLead) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to add members'
      });
    }

    await project.addMember(userId, role);

    res.json({
      success: true,
      message: 'Member added successfully'
    });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add member'
    });
  }
});

// @route   DELETE /api/projects/:id/members/:userId
// @desc    Remove member from project
// @access  Private
router.delete('/:id/members/:userId', authenticateToken, canAccessResource('project'), async (req, res) => {
  try {
    const project = req.resource;
    const { userId } = req.params;

    // Check if user is owner or lead
    const isOwner = project.owner.toString() === req.user._id.toString();
    const isLead = project.members.some(member => 
      member.user.toString() === req.user._id.toString() && 
      member.status === 'Active' && 
      ['Owner', 'Lead'].includes(member.role)
    );

    if (!isOwner && !isLead) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to remove members'
      });
    }

    await project.removeMember(userId);

    res.json({
      success: true,
      message: 'Member removed successfully'
    });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove member'
    });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private
router.delete('/:id', authenticateToken, canAccessResource('project'), async (req, res) => {
  try {
    const project = req.resource;

    // Check if user is owner
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the project owner can delete the project'
      });
    }

    await Project.findByIdAndDelete(project._id);

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project'
    });
  }
});

module.exports = router;
