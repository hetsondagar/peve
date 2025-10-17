import mongoose, { Schema, Types, Document } from 'mongoose';

export interface ICollaborationRequest extends Document {
  ideaId: Types.ObjectId;
  requesterId: Types.ObjectId;
  receiverId: Types.ObjectId;
  compatibilityScore: number;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const collaborationRequestSchema = new Schema<ICollaborationRequest>(
  {
    ideaId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Idea', 
      required: true,
      index: true
    },
    requesterId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true
    },
    receiverId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true
    },
    compatibilityScore: { 
      type: Number, 
      required: true,
      min: 0,
      max: 100
    },
    message: { 
      type: String, 
      maxlength: 500
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
      index: true
    }
  },
  { timestamps: true }
);

// Compound indexes for efficient queries
collaborationRequestSchema.index({ requesterId: 1, status: 1 });
collaborationRequestSchema.index({ receiverId: 1, status: 1 });
collaborationRequestSchema.index({ ideaId: 1, requesterId: 1 }, { unique: true }); // Prevent duplicate requests

export const CollaborationRequest = mongoose.model<ICollaborationRequest>('CollaborationRequest', collaborationRequestSchema);
