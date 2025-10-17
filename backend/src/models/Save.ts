import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISave extends Document {
  userId: Types.ObjectId;
  targetType: 'project' | 'idea' | 'comment' | 'prompt';
  targetId: Types.ObjectId;
  createdAt: Date;
}

const saveSchema = new Schema<ISave>(
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

// Ensure one save per user per target
saveSchema.index({ userId: 1, targetType: 1, targetId: 1 }, { unique: true });
saveSchema.index({ targetType: 1, targetId: 1 });

export const Save = mongoose.model<ISave>('Save', saveSchema);
