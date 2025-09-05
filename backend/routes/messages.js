const express = require('express');
const { body, validationResult } = require('express-validator');
const Message = require('../models/Message');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/messages/conversations
// @desc    Get user's conversations
// @access  Private
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const conversations = await Message.getUserConversations(req.user._id);

    res.json({
      success: true,
      data: { conversations }
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations'
    });
  }
});

// @route   GET /api/messages/:userId
// @desc    Get messages between current user and another user
// @access  Private
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Check if the other user exists
    const otherUser = await User.findById(userId).select('firstName lastName avatar isActive');
    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const messages = await Message.getConversation(req.user._id, userId, page, limit);

    // Mark messages as read
    await Message.updateMany(
      {
        sender: userId,
        recipient: req.user._id,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.json({
      success: true,
      data: {
        messages: messages.reverse(), // Show oldest first
        otherUser,
        pagination: {
          current: parseInt(page),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
});

// @route   POST /api/messages
// @desc    Send a message
// @access  Private
router.post('/', authenticateToken, [
  body('recipient').isMongoId().withMessage('Valid recipient ID is required'),
  body('content').trim().isLength({ min: 1, max: 2000 }).withMessage('Message content is required and must be less than 2000 characters'),
  body('type').optional().isIn(['text', 'image', 'file', 'project_invite', 'collaboration_request']),
  body('replyTo').optional().isMongoId()
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

    const { recipient, content, type = 'text', replyTo, project } = req.body;

    // Check if recipient exists and is active
    const recipientUser = await User.findById(recipient).select('firstName lastName isActive');
    if (!recipientUser || !recipientUser.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found or inactive'
      });
    }

    // Check if replying to a valid message
    if (replyTo) {
      const replyMessage = await Message.findById(replyTo);
      if (!replyMessage) {
        return res.status(404).json({
          success: false,
          message: 'Reply message not found'
        });
      }
    }

    const messageData = {
      sender: req.user._id,
      recipient,
      content,
      type,
      replyTo,
      project
    };

    const message = await Message.create(messageData);

    // Populate the message
    await message.populate([
      { path: 'sender', select: 'firstName lastName avatar' },
      { path: 'recipient', select: 'firstName lastName avatar' },
      { path: 'replyTo', select: 'content sender' },
      { path: 'project', select: 'title' }
    ]);

    // Emit real-time message via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${recipient}`).emit('new_message', {
        message,
        conversationId: message.conversationId
      });
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: { message }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
});

// @route   PUT /api/messages/:id/read
// @desc    Mark message as read
// @access  Private
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is the recipient
    if (message.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only mark your own messages as read'
      });
    }

    await message.markAsRead();

    res.json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark message as read'
    });
  }
});

// @route   PUT /api/messages/:id
// @desc    Edit message
// @access  Private
router.put('/:id', authenticateToken, [
  body('content').trim().isLength({ min: 1, max: 2000 }).withMessage('Message content is required and must be less than 2000 characters')
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

    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is the sender
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own messages'
      });
    }

    // Check if message is not too old (e.g., 24 hours)
    const hoursSinceCreated = (new Date() - message.createdAt) / (1000 * 60 * 60);
    if (hoursSinceCreated > 24) {
      return res.status(400).json({
        success: false,
        message: 'Message is too old to edit'
      });
    }

    message.content = req.body.content;
    message.isEdited = true;
    message.editedAt = new Date();

    await message.save();

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${message.recipient}`).emit('message_edited', {
        messageId: message._id,
        content: message.content,
        editedAt: message.editedAt
      });
    }

    res.json({
      success: true,
      message: 'Message updated successfully',
      data: { message }
    });
  } catch (error) {
    console.error('Edit message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to edit message'
    });
  }
});

// @route   DELETE /api/messages/:id
// @desc    Delete message
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is the sender or recipient
    const isSender = message.sender.toString() === req.user._id.toString();
    const isRecipient = message.recipient.toString() === req.user._id.toString();

    if (!isSender && !isRecipient) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own messages'
      });
    }

    // Soft delete
    message.isDeleted = true;
    message.deletedAt = new Date();
    await message.save();

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      const otherUserId = isSender ? message.recipient : message.sender;
      io.to(`user_${otherUserId}`).emit('message_deleted', {
        messageId: message._id
      });
    }

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message'
    });
  }
});

// @route   POST /api/messages/:id/reaction
// @desc    Add reaction to message
// @access  Private
router.post('/:id/reaction', authenticateToken, [
  body('emoji').notEmpty().withMessage('Emoji is required')
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

    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    const { emoji } = req.body;

    await message.addReaction(req.user._id, emoji);

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      const otherUserId = message.sender.toString() === req.user._id.toString() 
        ? message.recipient 
        : message.sender;
      io.to(`user_${otherUserId}`).emit('message_reaction', {
        messageId: message._id,
        emoji,
        userId: req.user._id
      });
    }

    res.json({
      success: true,
      message: 'Reaction added successfully',
      data: { reactions: message.reactions }
    });
  } catch (error) {
    console.error('Add reaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add reaction'
    });
  }
});

// @route   DELETE /api/messages/:id/reaction
// @desc    Remove reaction from message
// @access  Private
router.delete('/:id/reaction', authenticateToken, [
  body('emoji').notEmpty().withMessage('Emoji is required')
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

    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    const { emoji } = req.body;

    await message.removeReaction(req.user._id, emoji);

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      const otherUserId = message.sender.toString() === req.user._id.toString() 
        ? message.recipient 
        : message.sender;
      io.to(`user_${otherUserId}`).emit('message_reaction_removed', {
        messageId: message._id,
        emoji,
        userId: req.user._id
      });
    }

    res.json({
      success: true,
      message: 'Reaction removed successfully',
      data: { reactions: message.reactions }
    });
  } catch (error) {
    console.error('Remove reaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove reaction'
    });
  }
});

// @route   GET /api/messages/unread/count
// @desc    Get unread message count
// @access  Private
router.get('/unread/count', authenticateToken, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      recipient: req.user._id,
      isRead: false,
      isDeleted: false
    });

    res.json({
      success: true,
      data: { unreadCount: count }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count'
    });
  }
});

module.exports = router;
