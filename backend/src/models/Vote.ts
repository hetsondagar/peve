import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IVote extends Document {
  userId: Types.ObjectId;
  promptId: Types.ObjectId;
  voteType: 'agree' | 'disagree' | 'yes' | 'no' | 'option';
  optionValue?: string; // For poll-type prompts with specific options
  createdAt: Date;
}

const voteSchema = new Schema<IVote>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    promptId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Prompt', 
      required: true 
    },
    voteType: { 
      type: String, 
      enum: ['agree', 'disagree', 'yes', 'no', 'option'],
      required: true 
    },
    optionValue: { type: String } // For poll-type prompts
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Ensure one vote per user per prompt
voteSchema.index({ userId: 1, promptId: 1 }, { unique: true });
voteSchema.index({ promptId: 1, voteType: 1 });

export const Vote = mongoose.model<IVote>('Vote', voteSchema);
