import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ILike extends Document {
  userId: Types.ObjectId;
  targetType: 'project' | 'idea' | 'comment' | 'prompt';
  targetId: Types.ObjectId;
  createdAt: Date;
}

const likeSchema = new Schema<ILike>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    targetType: { 
      type: String, 
      enum: ['project', 'idea', 'comment', 'prompt'],
      required: true 
    },
    targetId: { 
      type: Schema.Types.ObjectId, 
      required: true 
    }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Ensure one like per user per target
likeSchema.index({ userId: 1, targetType: 1, targetId: 1 }, { unique: true });
likeSchema.index({ targetType: 1, targetId: 1 });

export const Like = mongoose.model<ILike>('Like', likeSchema);
