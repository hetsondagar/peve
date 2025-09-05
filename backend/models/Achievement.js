const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Achievement name is required'],
    trim: true,
    maxlength: [100, 'Achievement name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Achievement description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  icon: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Social', 'Technical', 'Collaboration', 'Learning', 'Leadership', 'Special']
  },
  
  // Achievement Requirements
  requirements: {
    type: {
      type: String,
      enum: ['manual', 'automatic', 'milestone'],
      default: 'automatic'
    },
    criteria: {
      connections: {
        type: Number,
        default: 0
      },
      projects: {
        type: Number,
        default: 0
      },
      messages: {
        type: Number,
        default: 0
      },
      profileViews: {
        type: Number,
        default: 0
      },
      skills: {
        type: Number,
        default: 0
      },
      customConditions: [{
        field: String,
        operator: {
          type: String,
          enum: ['equals', 'greater_than', 'less_than', 'contains']
        },
        value: mongoose.Schema.Types.Mixed
      }]
    }
  },
  
  // Achievement Properties
  rarity: {
    type: String,
    enum: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'],
    default: 'Common'
  },
  points: {
    type: Number,
    default: 10,
    min: 1
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Visual Properties
  color: {
    type: String,
    default: '#3B82F6'
  },
  gradient: {
    type: String,
    default: 'from-blue-500 to-purple-600'
  },
  
  // Statistics
  stats: {
    totalEarned: {
      type: Number,
      default: 0
    },
    lastEarned: {
      type: Date
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for efficient querying
achievementSchema.index({ category: 1, rarity: 1 });
achievementSchema.index({ isActive: 1, isHidden: 1 });

// Method to check if user meets requirements
achievementSchema.methods.checkRequirements = function(user) {
  const criteria = this.requirements.criteria;
  
  // Check basic criteria
  if (criteria.connections && user.stats.connections < criteria.connections) {
    return false;
  }
  if (criteria.projects && user.stats.projects < criteria.projects) {
    return false;
  }
  if (criteria.messages && user.stats.messages < criteria.messages) {
    return false;
  }
  if (criteria.profileViews && user.stats.profileViews < criteria.profileViews) {
    return false;
  }
  if (criteria.skills && user.skills.length < criteria.skills) {
    return false;
  }
  
  // Check custom conditions
  for (const condition of criteria.customConditions) {
    const userValue = this.getNestedValue(user, condition.field);
    if (!this.evaluateCondition(userValue, condition.operator, condition.value)) {
      return false;
    }
  }
  
  return true;
};

// Helper method to get nested object values
achievementSchema.methods.getNestedValue = function(obj, path) {
  return path.split('.').reduce((current, key) => current && current[key], obj);
};

// Helper method to evaluate conditions
achievementSchema.methods.evaluateCondition = function(userValue, operator, targetValue) {
  switch (operator) {
    case 'equals':
      return userValue === targetValue;
    case 'greater_than':
      return userValue > targetValue;
    case 'less_than':
      return userValue < targetValue;
    case 'contains':
      return Array.isArray(userValue) ? userValue.includes(targetValue) : 
             typeof userValue === 'string' ? userValue.includes(targetValue) : false;
    default:
      return false;
  }
};

module.exports = mongoose.model('Achievement', achievementSchema);
