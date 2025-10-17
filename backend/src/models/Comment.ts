import mongoose, { Schema, Types, Document } from 'mongoose';

export interface IComment extends Document {
  content: string;
  author: Types.ObjectId;
  targetType: 'idea' | 'project' | 'prompt';
  targetId: Types.ObjectId;
  parentComment?: Types.ObjectId; // For nested comments/replies
  likes: number;
  likedBy: Types.ObjectId[];
  saveCount: number;
  isEdited: boolean;
  editedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    content: { 
      type: String, 
      required: true, 
      maxlength: 1000,
      trim: true 
    },
    author: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    targetType: { 
      type: String, 
      enum: ['idea', 'project', 'prompt'], 
      required: true 
    },
    targetId: { 
      type: Schema.Types.ObjectId, 
      required: true 
    },
    parentComment: { 
      type: Schema.Types.ObjectId, 
      ref: 'Comment' 
    },
    likes: { 
      type: Number, 
      default: 0 
    },
    likedBy: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'User' 
    }],
    saveCount: { 
      type: Number, 
      default: 0 
    },
    isEdited: { 
      type: Boolean, 
      default: false 
    },
    editedAt: { 
      type: Date 
    },
  },
  { 
    timestamps: true 
  }
);

// Indexes for efficient queries
commentSchema.index({ targetType: 1, targetId: 1, createdAt: -1 });
commentSchema.index({ author: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1 });

// Virtual for nested comments count
commentSchema.virtual('repliesCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentComment',
  count: true
});

// Ensure virtual fields are serialized
commentSchema.set('toJSON', { virtuals: true });

export const Comment = mongoose.model<IComment>('Comment', commentSchema);