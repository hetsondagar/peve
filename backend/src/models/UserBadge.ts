import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUserBadge extends Document {
  userId: Types.ObjectId;
  badgeId: Types.ObjectId;
  earnedAt: Date;
  pointsAwarded: number;
  isDisplayed: boolean; // Whether user wants to display this badge
  createdAt: Date;
  updatedAt: Date;
}

const userBadgeSchema = new Schema<IUserBadge>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true
    },
    badgeId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Badge', 
      required: true,
      index: true
    },
    earnedAt: { 
      type: Date, 
      required: true,
      default: Date.now
    },
    pointsAwarded: { 
      type: Number, 
      required: true,
      default: 0
    },
    isDisplayed: { 
      type: Boolean, 
      default: true 
    }
  },
  { timestamps: true }
);

// Ensure one badge per user (unique constraint)
userBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });

// Indexes for efficient queries
userBadgeSchema.index({ userId: 1, earnedAt: -1 });
userBadgeSchema.index({ badgeId: 1 });

export const UserBadge = mongoose.model<IUserBadge>('UserBadge', userBadgeSchema);
