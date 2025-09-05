const express = require('express');
const { body, validationResult } = require('express-validator');
const Event = require('../models/Event');
const User = require('../models/User');
const { authenticateToken, optionalAuth, canAccessResource } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/events
// @desc    Get all events (with search and filters)
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      search,
      type,
      category,
      location,
      startDate,
      endDate,
      page = 1,
      limit = 20,
      sort = 'startDate',
      order = 'asc'
    } = req.query;

    const skip = (page - 1) * limit;
    const query = { isPublic: true, status: 'Published' };

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by type
    if (type) {
      query.type = type;
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by location
    if (location) {
      query['location.city'] = { $regex: location, $options: 'i' };
    }

    // Filter by date range
    if (startDate) {
      query.startDate = { $gte: new Date(startDate) };
    }
    if (endDate) {
      query.endDate = { $lte: new Date(endDate) };
    }

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;

    const events = await Event.find(query)
      .populate('organizer', 'name logo')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Event.countDocuments(query);

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events'
    });
  }
});

// @route   GET /api/events/featured
// @desc    Get featured events
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const events = await Event.find({
      isPublic: true,
      isFeatured: true,
      status: 'Published',
      startDate: { $gte: new Date() }
    })
    .populate('organizer', 'name logo')
    .sort({ startDate: 1 })
    .limit(6);

    res.json({
      success: true,
      data: { events }
    });
  } catch (error) {
    console.error('Get featured events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured events'
    });
  }
});

// @route   GET /api/events/upcoming
// @desc    Get upcoming events
// @access  Public
router.get('/upcoming', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const events = await Event.find({
      isPublic: true,
      status: 'Published',
      startDate: { $gte: new Date() }
    })
    .populate('organizer', 'name logo')
    .sort({ startDate: 1 })
    .limit(parseInt(limit));

    res.json({
      success: true,
      data: { events }
    });
  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch upcoming events'
    });
  }
});

// @route   GET /api/events/:id
// @desc    Get event by ID
// @access  Public
router.get('/:id', optionalAuth, canAccessResource('event'), async (req, res) => {
  try {
    const event = req.resource;

    // Increment views if not the organizer
    if (!req.user || req.user._id.toString() !== event.organizer._id.toString()) {
      await Event.findByIdAndUpdate(event._id, {
        $inc: { 'stats.views': 1 }
      });
    }

    res.json({
      success: true,
      data: { event }
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event'
    });
  }
});

// @route   POST /api/events
// @desc    Create new event
// @access  Private
router.post('/', authenticateToken, [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required and must be less than 100 characters'),
  body('description').isLength({ min: 1, max: 2000 }).withMessage('Description is required and must be less than 2000 characters'),
  body('type').isIn(['Workshop', 'Hackathon', 'Meetup', 'Conference', 'Webinar', 'Job Fair', 'Networking', 'Other']),
  body('category').isIn(['Technology', 'Design', 'Business', 'Career', 'Education', 'Networking', 'Other']),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
  body('location.type').isIn(['online', 'physical', 'hybrid']),
  body('maxAttendees').optional().isInt({ min: 1 }),
  body('pricing.type').isIn(['free', 'paid', 'donation'])
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

    const eventData = {
      ...req.body,
      organizer: {
        name: req.user.fullName,
        email: req.user.email,
        logo: req.user.avatar
      }
    };

    const event = await Event.create(eventData);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { event }
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event'
    });
  }
});

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private
router.put('/:id', authenticateToken, canAccessResource('event'), [
  body('title').optional().trim().isLength({ min: 1, max: 100 }),
  body('description').optional().isLength({ min: 1, max: 2000 }),
  body('status').optional().isIn(['Draft', 'Published', 'Cancelled', 'Completed'])
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

    const event = req.resource;

    // Check if user is the organizer
    if (event.organizer.email !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to edit this event'
      });
    }

    const allowedUpdates = [
      'title', 'description', 'shortDescription', 'type', 'category', 'tags',
      'startDate', 'endDate', 'duration', 'location', 'maxAttendees',
      'isRegistrationRequired', 'registrationDeadline', 'pricing',
      'requirements', 'images', 'status', 'isFeatured', 'isPublic'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: { event: updatedEvent }
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event'
    });
  }
});

// @route   POST /api/events/:id/register
// @desc    Register for event
// @access  Private
router.post('/:id/register', authenticateToken, canAccessResource('event'), async (req, res) => {
  try {
    const event = req.resource;

    // Check if registration is open
    if (!event.isRegistrationOpen) {
      return res.status(400).json({
        success: false,
        message: 'Registration is not open for this event'
      });
    }

    // Check if user is already registered
    const isRegistered = event.attendees.some(attendee => 
      attendee.user.toString() === req.user._id.toString() && 
      attendee.status === 'Registered'
    );

    if (isRegistered) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }

    await event.registerUser(req.user._id);

    res.json({
      success: true,
      message: 'Successfully registered for the event'
    });
  } catch (error) {
    console.error('Register for event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register for event'
    });
  }
});

// @route   DELETE /api/events/:id/register
// @desc    Cancel event registration
// @access  Private
router.delete('/:id/register', authenticateToken, canAccessResource('event'), async (req, res) => {
  try {
    const event = req.resource;

    await event.cancelRegistration(req.user._id);

    res.json({
      success: true,
      message: 'Registration cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel registration'
    });
  }
});

// @route   GET /api/events/my/registered
// @desc    Get events user is registered for
// @access  Private
router.get('/my/registered', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const events = await Event.find({
      'attendees.user': req.user._id,
      'attendees.status': 'Registered'
    })
    .populate('organizer', 'name logo')
    .sort({ startDate: 1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Event.countDocuments({
      'attendees.user': req.user._id,
      'attendees.status': 'Registered'
    });

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get registered events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registered events'
    });
  }
});

// @route   GET /api/events/my/created
// @desc    Get events created by user
// @access  Private
router.get('/my/created', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const events = await Event.find({
      'organizer.email': req.user.email
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Event.countDocuments({
      'organizer.email': req.user.email
    });

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get created events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch created events'
    });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private
router.delete('/:id', authenticateToken, canAccessResource('event'), async (req, res) => {
  try {
    const event = req.resource;

    // Check if user is the organizer
    if (event.organizer.email !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this event'
      });
    }

    await Event.findByIdAndDelete(event._id);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event'
    });
  }
});

module.exports = router;
