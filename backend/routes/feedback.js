const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const router = express.Router();

// Mock feedback data (in a real app, this would be stored in a database)
let feedbackData = [];

// @route   POST /api/feedback
// @desc    Submit feedback
// @access  Public
router.post('/', optionalAuth, [
  body('type').isIn(['bug', 'feature', 'improvement', 'general', 'complaint']).withMessage('Valid feedback type is required'),
  body('subject').trim().isLength({ min: 1, max: 200 }).withMessage('Subject is required and must be less than 200 characters'),
  body('message').trim().isLength({ min: 1, max: 2000 }).withMessage('Message is required and must be less than 2000 characters'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('email').optional().isEmail().withMessage('Valid email is required')
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

    const {
      type,
      subject,
      message,
      priority = 'medium',
      email,
      attachments = []
    } = req.body;

    const feedback = {
      id: Date.now().toString(),
      type,
      subject,
      message,
      priority,
      email: email || (req.user ? req.user.email : null),
      userId: req.user ? req.user._id : null,
      attachments,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // In a real app, you would save this to a database
    feedbackData.push(feedback);

    // In a real app, you would:
    // 1. Send email notification to support team
    // 2. Create ticket in support system
    // 3. Send confirmation email to user

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: { 
        feedbackId: feedback.id,
        status: feedback.status
      }
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback'
    });
  }
});

// @route   GET /api/feedback/faq
// @desc    Get frequently asked questions
// @access  Public
router.get('/faq', async (req, res) => {
  try {
    const faqs = [
      {
        id: '1',
        category: 'Account',
        question: 'How do I reset my password?',
        answer: 'You can reset your password by clicking the "Forgot Password" link on the login page. Enter your email address and follow the instructions sent to your email.',
        tags: ['password', 'account', 'security']
      },
      {
        id: '2',
        category: 'Account',
        question: 'How do I update my profile information?',
        answer: 'Go to your profile page and click the "Edit Profile" button. You can update your personal information, skills, and preferences from there.',
        tags: ['profile', 'account', 'settings']
      },
      {
        id: '3',
        category: 'Projects',
        question: 'How do I create a new project?',
        answer: 'Navigate to the Projects page and click "Create Project". Fill in the project details, add required skills, and set collaboration preferences.',
        tags: ['projects', 'creation', 'collaboration']
      },
      {
        id: '4',
        category: 'Projects',
        question: 'How do I join a project?',
        answer: 'Browse available projects and click "Apply to Join" on projects that interest you. The project owner will review your application.',
        tags: ['projects', 'joining', 'application']
      },
      {
        id: '5',
        category: 'Messaging',
        question: 'How do I send a message to another user?',
        answer: 'Go to the Messages page, find the user you want to message, and click on their conversation. Type your message and press send.',
        tags: ['messaging', 'communication', 'users']
      },
      {
        id: '6',
        category: 'Events',
        question: 'How do I register for an event?',
        answer: 'Browse the Events page, find an event you\'re interested in, and click "Register". Some events may require approval from the organizer.',
        tags: ['events', 'registration', 'networking']
      },
      {
        id: '7',
        category: 'Learning',
        question: 'How do I access learning resources?',
        answer: 'Go to the Learning Hub to browse available courses and tutorials. You can filter by category, difficulty, and price.',
        tags: ['learning', 'courses', 'education']
      },
      {
        id: '8',
        category: 'Technical',
        question: 'The website is not loading properly. What should I do?',
        answer: 'Try refreshing the page, clearing your browser cache, or using a different browser. If the problem persists, contact our support team.',
        tags: ['technical', 'loading', 'browser']
      }
    ];

    res.json({
      success: true,
      data: { faqs }
    });
  } catch (error) {
    console.error('Get FAQ error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch FAQ'
    });
  }
});

// @route   GET /api/feedback/faq/categories
// @desc    Get FAQ categories
// @access  Public
router.get('/faq/categories', async (req, res) => {
  try {
    const categories = [
      { name: 'Account', count: 2, icon: '👤' },
      { name: 'Projects', count: 2, icon: '🚀' },
      { name: 'Messaging', count: 1, icon: '💬' },
      { name: 'Events', count: 1, icon: '📅' },
      { name: 'Learning', count: 1, icon: '📚' },
      { name: 'Technical', count: 1, icon: '🔧' }
    ];

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Get FAQ categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch FAQ categories'
    });
  }
});

// @route   GET /api/feedback/my
// @desc    Get user's feedback submissions
// @access  Private
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    let userFeedback = feedbackData.filter(feedback => 
      feedback.userId && feedback.userId.toString() === req.user._id.toString()
    );

    if (status) {
      userFeedback = userFeedback.filter(feedback => feedback.status === status);
    }

    // Sort by creation date (newest first)
    userFeedback.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const paginatedFeedback = userFeedback.slice(skip, skip + parseInt(limit));

    res.json({
      success: true,
      data: {
        feedback: paginatedFeedback,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(userFeedback.length / limit),
          total: userFeedback.length,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get my feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your feedback'
    });
  }
});

// @route   GET /api/feedback/:id
// @desc    Get feedback by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const feedback = feedbackData.find(f => f.id === req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Check if user owns the feedback or is admin
    if (feedback.userId && feedback.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own feedback'
      });
    }

    res.json({
      success: true,
      data: { feedback }
    });
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback'
    });
  }
});

// @route   PUT /api/feedback/:id
// @desc    Update feedback
// @access  Private
router.put('/:id', authenticateToken, [
  body('subject').optional().trim().isLength({ min: 1, max: 200 }),
  body('message').optional().trim().isLength({ min: 1, max: 2000 }),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent'])
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

    const feedbackIndex = feedbackData.findIndex(f => f.id === req.params.id);

    if (feedbackIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    const feedback = feedbackData[feedbackIndex];

    // Check if user owns the feedback
    if (feedback.userId && feedback.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own feedback'
      });
    }

    // Check if feedback can be updated (e.g., not closed)
    if (feedback.status === 'closed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update closed feedback'
      });
    }

    // Update feedback
    const allowedUpdates = ['subject', 'message', 'priority'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        feedback[field] = req.body[field];
      }
    });

    feedback.updatedAt = new Date();

    res.json({
      success: true,
      message: 'Feedback updated successfully',
      data: { feedback }
    });
  } catch (error) {
    console.error('Update feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update feedback'
    });
  }
});

// @route   POST /api/feedback/search
// @desc    Search FAQ and help content
// @access  Public
router.post('/search', [
  body('query').trim().isLength({ min: 1, max: 100 }).withMessage('Search query is required')
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

    const { query } = req.body;
    const searchLower = query.toLowerCase();

    // Mock search results (in a real app, you'd use a proper search engine)
    const faqs = [
      {
        id: '1',
        category: 'Account',
        question: 'How do I reset my password?',
        answer: 'You can reset your password by clicking the "Forgot Password" link on the login page.',
        tags: ['password', 'account', 'security']
      },
      {
        id: '2',
        category: 'Account',
        question: 'How do I update my profile information?',
        answer: 'Go to your profile page and click the "Edit Profile" button.',
        tags: ['profile', 'account', 'settings']
      }
    ];

    const searchResults = faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchLower) ||
      faq.answer.toLowerCase().includes(searchLower) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );

    res.json({
      success: true,
      data: { 
        results: searchResults,
        query,
        total: searchResults.length
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search help content'
    });
  }
});

module.exports = router;
