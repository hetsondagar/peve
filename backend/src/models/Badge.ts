import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBadge extends Document {
  key: string;
  name: string;
  description: string;
  icon: string;
  category: 'achievement' | 'milestone' | 'special' | 'social' | 'technical';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  criteria: {
    type: 'count' | 'streak' | 'rank' | 'interaction' | 'custom';
    target?: string; // 'projects', 'ideas', 'comments', 'likes', 'saves', etc.
    threshold?: number;
    timeframe?: string; // 'daily', 'weekly', 'monthly', 'all_time'
    customLogic?: string; // For complex badge logic
  };
  points: number; // Points awarded for earning this badge
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const badgeSchema = new Schema<IBadge>(
  {
    key: { 
      type: String, 
      required: true, 
      unique: true,
      index: true
    },
    name: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    icon: { 
      type: String, 
      required: true 
    },
    category: { 
      type: String, 
      enum: ['achievement', 'milestone', 'special', 'social', 'technical'],
      required: true,
      index: true
    },
    rarity: { 
      type: String, 
      enum: ['common', 'rare', 'epic', 'legendary'],
      required: true,
      index: true
    },
    criteria: {
      type: {
        type: String,
        enum: ['count', 'streak', 'rank', 'interaction', 'custom'],
        required: true
      },
      target: String,
      threshold: Number,
      timeframe: String,
      customLogic: String
    },
    points: { 
      type: Number, 
      required: true,
      default: 0
    },
    isActive: { 
      type: Boolean, 
      default: true 
    }
  },
  { timestamps: true }
);

// Indexes for efficient queries
badgeSchema.index({ category: 1, rarity: 1 });
badgeSchema.index({ isActive: 1 });

export const Badge = mongoose.model<IBadge>('Badge', badgeSchema);


