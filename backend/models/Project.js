const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  
  // Project Details
  category: {
    type: String,
    required: true,
    enum: ['Web Development', 'Mobile App', 'AI/ML', 'Data Science', 'Design', 'DevOps', 'Blockchain', 'Game Development', 'Other']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  technologies: [{
    type: String,
    trim: true
  }],
  
  // Media
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  demoUrl: {
    type: String,
    default: ''
  },
  githubUrl: {
    type: String,
    default: ''
  },
  
  // Project Status
  status: {
    type: String,
    enum: ['Planning', 'In Progress', 'Completed', 'On Hold', 'Cancelled'],
    default: 'Planning'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  
  // Timeline
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  estimatedDuration: {
    type: Number, // in weeks
    default: 4
  },
  
  // Team
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['Owner', 'Lead', 'Developer', 'Designer', 'Contributor'],
      default: 'Contributor'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Left'],
      default: 'Active'
    }
  }],
  
  // Collaboration
  collaborationType: {
    type: String,
    enum: ['Open', 'Invite Only', 'Closed'],
    default: 'Open'
  },
  requiredSkills: [{
    name: String,
    level: {
      type: Number,
      min: 1,
      max: 5
    }
  }],
  maxMembers: {
    type: Number,
    default: 10
  },
  
  // Engagement
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  views: {
    type: Number,
    default: 0
  },
  applications: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      maxlength: [500, 'Application message cannot exceed 500 characters']
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending'
    }
  }],
  
  // AI Insights
  aiInsights: {
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Intermediate'
    },
    estimatedTime: {
      type: Number, // in hours
      default: 40
    },
    recommendedSkills: [String],
    similarProjects: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    }]
  },
  
  // Settings
  isPublic: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  allowComments: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for member count
projectSchema.virtual('memberCount').get(function() {
  return this.members.filter(member => member.status === 'Active').length;
});

// Virtual for like count
projectSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for application count
projectSchema.virtual('applicationCount').get(function() {
  return this.applications.filter(app => app.status === 'Pending').length;
});

// Index for search
projectSchema.index({ 
  title: 'text', 
  description: 'text', 
  tags: 'text',
  technologies: 'text'
});

// Index for filtering
projectSchema.index({ category: 1, status: 1, isPublic: 1 });
projectSchema.index({ owner: 1, createdAt: -1 });
projectSchema.index({ 'members.user': 1 });

// Pre-save middleware
projectSchema.pre('save', function(next) {
  // Ensure only one primary image
  if (this.images && this.images.length > 0) {
    const primaryImages = this.images.filter(img => img.isPrimary);
    if (primaryImages.length > 1) {
      // Keep only the first primary image
      this.images.forEach((img, index) => {
        if (index > 0) img.isPrimary = false;
      });
    }
  }
  
  // Generate short description if not provided
  if (!this.shortDescription && this.description) {
    this.shortDescription = this.description.substring(0, 200) + (this.description.length > 200 ? '...' : '');
  }
  
  next();
});

// Method to add member
projectSchema.methods.addMember = function(userId, role = 'Contributor') {
  const existingMember = this.members.find(member => 
    member.user.toString() === userId.toString()
  );
  
  if (existingMember) {
    existingMember.status = 'Active';
    existingMember.role = role;
    existingMember.joinedAt = new Date();
  } else {
    this.members.push({
      user: userId,
      role: role,
      joinedAt: new Date(),
      status: 'Active'
    });
  }
  
  return this.save();
};

// Method to remove member
projectSchema.methods.removeMember = function(userId) {
  const member = this.members.find(member => 
    member.user.toString() === userId.toString()
  );
  
  if (member) {
    member.status = 'Left';
  }
  
  return this.save();
};

// Method to like project
projectSchema.methods.likeProject = function(userId) {
  const existingLike = this.likes.find(like => 
    like.user.toString() === userId.toString()
  );
  
  if (!existingLike) {
    this.likes.push({ user: userId });
  }
  
  return this.save();
};

// Method to unlike project
projectSchema.methods.unlikeProject = function(userId) {
  this.likes = this.likes.filter(like => 
    like.user.toString() !== userId.toString()
  );
  
  return this.save();
};

// Method to apply to project
projectSchema.methods.applyToProject = function(userId, message = '') {
  const existingApplication = this.applications.find(app => 
    app.user.toString() === userId.toString()
  );
  
  if (!existingApplication) {
    this.applications.push({
      user: userId,
      message: message,
      appliedAt: new Date(),
      status: 'Pending'
    });
  }
  
  return this.save();
};

module.exports = mongoose.model('Project', projectSchema);
