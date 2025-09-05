const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'connection_request',
      'connection_accepted',
      'message_received',
      'project_invite',
      'project_application',
      'project_update',
      'achievement_earned',
      'event_reminder',
      'event_invite',
      'system_announcement',
      'profile_view',
      'skill_endorsement',
      'collaboration_request',
      'feedback_received'
    ]
  },
  title: {
    type: String,
    required: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  
  // Related entities
  relatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  relatedProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  relatedEvent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  relatedAchievement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement'
  },
  relatedMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  
  // Notification status
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  archivedAt: {
    type: Date
  },
  
  // Priority and grouping
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['social', 'professional', 'system', 'reminder'],
    default: 'professional'
  },
  
  // Action data
  actionData: {
    actionType: {
      type: String,
      enum: ['view', 'accept', 'decline', 'respond', 'navigate']
    },
    actionUrl: String,
    actionText: String,
    requiresResponse: {
      type: Boolean,
      default: false
    }
  },
  
  // Delivery settings
  delivery: {
    email: {
      sent: {
        type: Boolean,
        default: false
      },
      sentAt: Date
    },
    push: {
      sent: {
        type: Boolean,
        default: false
      },
      sentAt: Date
    },
    inApp: {
      type: Boolean,
      default: true
    }
  },
  
  // Metadata
  metadata: {
    source: {
      type: String,
      enum: ['system', 'user', 'ai', 'external'],
      default: 'system'
    },
    tags: [String],
    expiresAt: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for efficient querying
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1, isArchived: 1 });
notificationSchema.index({ type: 1, category: 1 });
notificationSchema.index({ 'metadata.expiresAt': 1 }, { expireAfterSeconds: 0 });

// Virtual for time ago
notificationSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diffInSeconds = Math.floor((now - this.createdAt) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return this.createdAt.toLocaleDateString();
});

// Pre-save middleware
notificationSchema.pre('save', function(next) {
  // Set expiration date for certain notification types
  if (!this.metadata.expiresAt) {
    const expirationDays = {
      'connection_request': 7,
      'project_invite': 14,
      'event_reminder': 1,
      'collaboration_request': 7
    };
    
    if (expirationDays[this.type]) {
      this.metadata.expiresAt = new Date(Date.now() + expirationDays[this.type] * 24 * 60 * 60 * 1000);
    }
  }
  
  next();
});

// Method to mark as read
notificationSchema.methods.markAsRead = function() {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to archive
notificationSchema.methods.archive = function() {
  if (!this.isArchived) {
    this.isArchived = true;
    this.archivedAt = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

// Static method to create notification
notificationSchema.statics.createNotification = function(data) {
  return this.create({
    user: data.userId,
    type: data.type,
    title: data.title,
    message: data.message,
    relatedUser: data.relatedUserId,
    relatedProject: data.relatedProjectId,
    relatedEvent: data.relatedEventId,
    relatedAchievement: data.relatedAchievementId,
    relatedMessage: data.relatedMessageId,
    priority: data.priority || 'medium',
    category: data.category || 'professional',
    actionData: data.actionData,
    metadata: {
      source: data.source || 'system',
      tags: data.tags || []
    }
  });
};

// Static method to get user notifications
notificationSchema.statics.getUserNotifications = function(userId, page = 1, limit = 20, filters = {}) {
  const skip = (page - 1) * limit;
  const query = {
    user: userId,
    isArchived: false
  };
  
  // Apply filters
  if (filters.isRead !== undefined) {
    query.isRead = filters.isRead;
  }
  if (filters.type) {
    query.type = filters.type;
  }
  if (filters.category) {
    query.category = filters.category;
  }
  if (filters.priority) {
    query.priority = filters.priority;
  }
  
  return this.find(query)
    .populate('relatedUser', 'firstName lastName avatar')
    .populate('relatedProject', 'title')
    .populate('relatedEvent', 'title startDate')
    .populate('relatedAchievement', 'name icon')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to mark all as read
notificationSchema.statics.markAllAsRead = function(userId) {
  return this.updateMany(
    { user: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({
    user: userId,
    isRead: false,
    isArchived: false
  });
};

module.exports = mongoose.model('Notification', notificationSchema);
