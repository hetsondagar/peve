import mongoose, { Schema, Types, Document } from 'mongoose';

export interface ICollaborationRequest extends Document {
  ideaId?: Types.ObjectId;
  projectId?: Types.ObjectId;
  requesterId: Types.ObjectId;
  receiverId: Types.ObjectId;
  compatibilityScore: number;
  message?: string;
  role?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const collaborationRequestSchema = new Schema<ICollaborationRequest>(
  {
    ideaId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Idea', 
      required: false,
      index: true
    },
    projectId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Project', 
      required: false,
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
    role: { 
      type: String, 
      maxlength: 100
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
collaborationRequestSchema.index({ ideaId: 1, requesterId: 1 }, { unique: true, sparse: true }); // Prevent duplicate requests for ideas
collaborationRequestSchema.index({ projectId: 1, requesterId: 1 }, { unique: true, sparse: true }); // Prevent duplicate requests for projects

// Add validation to ensure either ideaId or projectId is provided
collaborationRequestSchema.pre('validate', function(next) {
  if (!this.ideaId && !this.projectId) {
    next(new Error('Either ideaId or projectId must be provided'));
  } else if (this.ideaId && this.projectId) {
    next(new Error('Cannot have both ideaId and projectId'));
  } else {
    next();
  }
});

export const CollaborationRequest = mongoose.model<ICollaborationRequest>('CollaborationRequest', collaborationRequestSchema);
