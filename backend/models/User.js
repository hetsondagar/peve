const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  
  // Profile Information
  avatar: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: ''
  },
  location: {
    type: String,
    maxlength: [100, 'Location cannot exceed 100 characters'],
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  github: {
    type: String,
    default: ''
  },
  linkedin: {
    type: String,
    default: ''
  },
  twitter: {
    type: String,
    default: ''
  },
  
  // Professional Information
  title: {
    type: String,
    maxlength: [100, 'Title cannot exceed 100 characters'],
    default: ''
  },
  company: {
    type: String,
    maxlength: [100, 'Company cannot exceed 100 characters'],
    default: ''
  },
  experience: {
    type: String,
    enum: ['Student', 'Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Executive'],
    default: 'Student'
  },
  skills: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    level: {
      type: Number,
      min: 1,
      max: 5,
      default: 1
    },
    category: {
      type: String,
      enum: ['Technical', 'Design', 'Business', 'Soft Skills', 'Other'],
      default: 'Technical'
    }
  }],
  
  // Preferences
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      messages: {
        type: Boolean,
        default: true
      },
      projects: {
        type: Boolean,
        default: true
      },
      events: {
        type: Boolean,
        default: true
      }
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'connections', 'private'],
        default: 'public'
      },
      showEmail: {
        type: Boolean,
        default: false
      },
      showLocation: {
        type: Boolean,
        default: true
      }
    }
  },
  
  // Stats
  stats: {
    connections: {
      type: Number,
      default: 0
    },
    projects: {
      type: Number,
      default: 0
    },
    achievements: {
      type: Number,
      default: 0
    },
    profileViews: {
      type: Number,
      default: 0
    }
  },
  
  // Status
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  
  // AI Personalization
  aiProfile: {
    interests: [String],
    learningGoals: [String],
    collaborationStyle: {
      type: String,
      enum: ['Collaborative', 'Independent', 'Mixed'],
      default: 'Mixed'
    },
    preferredProjectTypes: [String]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for initials
userSchema.virtual('initials').get(function() {
  return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase();
});

// Index for search
userSchema.index({ 
  firstName: 'text', 
  lastName: 'text', 
  bio: 'text', 
  title: 'text',
  company: 'text',
  skills: 'text'
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to update last active
userSchema.methods.updateLastActive = function() {
  this.lastActive = new Date();
  return this.save({ validateBeforeSave: false });
};

// Method to get public profile
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.email;
  delete userObject.preferences;
  delete userObject.aiProfile;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
