const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  
  // Event Details
  type: {
    type: String,
    required: true,
    enum: ['Workshop', 'Hackathon', 'Meetup', 'Conference', 'Webinar', 'Job Fair', 'Networking', 'Other']
  },
  category: {
    type: String,
    required: true,
    enum: ['Technology', 'Design', 'Business', 'Career', 'Education', 'Networking', 'Other']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Organizer Information
  organizer: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true
    },
    website: {
      type: String,
      default: ''
    },
    logo: {
      type: String,
      default: ''
    }
  },
  
  // Event Schedule
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  
  // Location
  location: {
    type: {
      type: String,
      enum: ['online', 'physical', 'hybrid'],
      required: true
    },
    address: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    },
    country: {
      type: String,
      default: ''
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    onlineLink: {
      type: String,
      default: ''
    },
    platform: {
      type: String,
      enum: ['Zoom', 'Teams', 'Google Meet', 'Discord', 'Other'],
      default: 'Other'
    }
  },
  
  // Event Capacity
  maxAttendees: {
    type: Number,
    default: null
  },
  currentAttendees: {
    type: Number,
    default: 0
  },
  isRegistrationRequired: {
    type: Boolean,
    default: true
  },
  registrationDeadline: {
    type: Date
  },
  
  // Pricing
  pricing: {
    type: {
      type: String,
      enum: ['free', 'paid', 'donation'],
      default: 'free'
    },
    amount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  
  // Media
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  
  // Event Requirements
  requirements: {
    skills: [String],
    experience: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Any'],
      default: 'Any'
    },
    equipment: [String],
    prerequisites: [String]
  },
  
  // Engagement
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Registered', 'Attended', 'Cancelled'],
      default: 'Registered'
    },
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: {
        type: String,
        maxlength: [500, 'Feedback comment cannot exceed 500 characters']
      }
    }
  }],
  
  // AI Insights
  aiInsights: {
    recommendedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    similarEvents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    }],
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate'
    }
  },
  
  // Status
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Cancelled', 'Completed'],
    default: 'Draft'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  
  // Statistics
  stats: {
    views: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for registration status
eventSchema.virtual('isRegistrationOpen').get(function() {
  if (!this.isRegistrationRequired) return true;
  if (this.registrationDeadline && new Date() > this.registrationDeadline) return false;
  if (this.maxAttendees && this.currentAttendees >= this.maxAttendees) return false;
  return true;
});

// Virtual for event status
eventSchema.virtual('eventStatus').get(function() {
  const now = new Date();
  if (now < this.startDate) return 'Upcoming';
  if (now >= this.startDate && now <= this.endDate) return 'Live';
  return 'Completed';
});

// Index for search
eventSchema.index({ 
  title: 'text', 
  description: 'text', 
  tags: 'text',
  'organizer.name': 'text'
});

// Index for filtering
eventSchema.index({ type: 1, category: 1, status: 1 });
eventSchema.index({ startDate: 1, endDate: 1 });
eventSchema.index({ 'location.type': 1, 'location.city': 1 });
eventSchema.index({ isPublic: 1, isFeatured: 1 });

// Pre-save middleware
eventSchema.pre('save', function(next) {
  // Generate short description if not provided
  if (!this.shortDescription && this.description) {
    this.shortDescription = this.description.substring(0, 200) + (this.description.length > 200 ? '...' : '');
  }
  
  // Update current attendees count
  this.currentAttendees = this.attendees.filter(attendee => 
    attendee.status === 'Registered' || attendee.status === 'Attended'
  ).length;
  
  // Ensure only one primary image
  if (this.images && this.images.length > 0) {
    const primaryImages = this.images.filter(img => img.isPrimary);
    if (primaryImages.length > 1) {
      this.images.forEach((img, index) => {
        if (index > 0) img.isPrimary = false;
      });
    }
  }
  
  next();
});

// Method to register user for event
eventSchema.methods.registerUser = function(userId) {
  const existingRegistration = this.attendees.find(attendee => 
    attendee.user.toString() === userId.toString()
  );
  
  if (!existingRegistration) {
    this.attendees.push({
      user: userId,
      registeredAt: new Date(),
      status: 'Registered'
    });
  }
  
  return this.save();
};

// Method to cancel registration
eventSchema.methods.cancelRegistration = function(userId) {
  const registration = this.attendees.find(attendee => 
    attendee.user.toString() === userId.toString()
  );
  
  if (registration) {
    registration.status = 'Cancelled';
  }
  
  return this.save();
};

// Method to mark attendance
eventSchema.methods.markAttendance = function(userId) {
  const registration = this.attendees.find(attendee => 
    attendee.user.toString() === userId.toString()
  );
  
  if (registration) {
    registration.status = 'Attended';
  }
  
  return this.save();
};

module.exports = mongoose.model('Event', eventSchema);
