import mongoose, { Schema, Document } from 'mongoose';

export interface IPrompt extends Document {
  question: string;
  type: 'open' | 'poll' | 'debate' | 'hypothetical' | 'humor' | 'philosophy';
  category: 'tech' | 'community' | 'future' | 'culture' | 'personal' | 'philosophy';
  options?: string[]; // For poll-type prompts
  tags: string[];
  saveCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const promptSchema = new Schema<IPrompt>(
  {
    question: { 
      type: String, 
      required: true,
      maxlength: [500, 'Question cannot exceed 500 characters']
    },
    type: { 
      type: String, 
      enum: ['open', 'poll', 'debate', 'hypothetical', 'humor', 'philosophy'],
      required: true 
    },
    category: { 
      type: String, 
      enum: ['tech', 'community', 'future', 'culture', 'personal', 'philosophy'],
      required: true 
    },
    options: [{ type: String }], // For poll-type prompts
    tags: [{ type: String }],
    saveCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

promptSchema.index({ category: 1, type: 1 });
promptSchema.index({ isActive: 1 });

export const Prompt = mongoose.model<IPrompt>('Prompt', promptSchema);
