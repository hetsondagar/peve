import mongoose, { Schema, Document } from 'mongoose';

export interface ICollaboration extends Document {
  ideaId: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  requester: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  skills: string[];
  experience?: string;
  availability?: string;
  createdAt: Date;
  updatedAt: Date;
}

const collaborationSchema = new Schema<ICollaboration>(
  {
    ideaId: { type: Schema.Types.ObjectId, ref: 'Idea', required: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
    requester: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { 
      type: String, 
      enum: ['pending', 'accepted', 'rejected'], 
      default: 'pending' 
    },
    message: { type: String },
    skills: [{ type: String }],
    experience: { type: String },
    availability: { type: String },
  },
  { timestamps: true }
);

collaborationSchema.index({ ideaId: 1, requester: 1 }, { unique: true });
collaborationSchema.index({ owner: 1, status: 1 });
collaborationSchema.index({ requester: 1, status: 1 });

export const Collaboration = mongoose.model<ICollaboration>('Collaboration', collaborationSchema);
