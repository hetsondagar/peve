const mongoose = require('mongoose');

const userAchievementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  achievement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement',
    required: true
  },
  earnedAt: {
    type: Date,
    default: Date.now
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  isNotified: {
    type: Boolean,
    default: false
  },
  isDisplayed: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index to ensure unique user-achievement pairs
userAchievementSchema.index({ user: 1, achievement: 1 }, { unique: true });

// Index for efficient querying
userAchievementSchema.index({ user: 1, earnedAt: -1 });
userAchievementSchema.index({ achievement: 1, earnedAt: -1 });

// Populate achievement details when querying
userAchievementSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'achievement',
    select: 'name description icon category rarity points color gradient'
  });
  next();
});

module.exports = mongoose.model('UserAchievement', userAchievementSchema);
