import mongoose, { Schema, Types, Document } from 'mongoose';

export interface IIdea extends Document {
  title: string;
  description: string;
  author: Types.ObjectId;
  tags: string[];
  brand?: string;
  mode: 'brainstorm' | 'want_to_build';
  status: 'brainstorm' | 'planning' | 'in-progress' | 'completed' | 'on-hold';
  attachments: {
    url: string;
    publicId: string;
    type: string;
  }[];
  collaborators: {
    user: Types.ObjectId;
    role: string;
    joinedAt: Date;
    accepted: boolean;
  }[];
  requests: {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    role: string;
    message: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: Date;
  }[];
  collabRequests: {
    requesterId: Types.ObjectId;
    status: 'pending' | 'accepted' | 'rejected';
    score: number;
    message?: string;
  }[];
  teamMembers: Types.ObjectId[];
  likes: number;
  likedBy: Types.ObjectId[];
  views: number;
  comments: number;
  commentCount: number;
  saveCount: number;
  skillsNeeded: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: string;
  isPublic: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const attachmentSchema = new Schema(
  {
    url: String,
    publicId: String,
    type: String,
  },
  { _id: false }
);

const collaboratorSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    role: String,
    joinedAt: Date,
    accepted: { type: Boolean, default: false },
  },
  { _id: false }
);

const requestSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    role: String,
    message: String,
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const collabRequestSchema = new Schema(
  {
    requesterId: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    score: { type: Number, min: 0, max: 100 },
    message: String,
  },
  { _id: false }
);

const ideaSchema = new Schema<IIdea>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tags: { type: [String] },
    brand: String,
    mode: {
      type: String,
      enum: ['brainstorm', 'want_to_build'],
      default: 'brainstorm'
    },
    status: { 
      type: String, 
      enum: ['brainstorm', 'planning', 'in-progress', 'completed', 'on-hold'], 
      default: 'brainstorm' 
    },
    attachments: [attachmentSchema],
    collaborators: [collaboratorSchema],
    requests: [requestSchema],
    collabRequests: [collabRequestSchema],
    teamMembers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    likes: { type: Number, default: 0 },
    likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    views: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    saveCount: { type: Number, default: 0 },
    skillsNeeded: { type: [String] },
    difficulty: { 
      type: String, 
      enum: ['beginner', 'intermediate', 'advanced'], 
      default: 'beginner' 
    },
    estimatedTime: String,
    isPublic: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ideaSchema.index({ author: 1 });
ideaSchema.index({ tags: 1 });
ideaSchema.index({ skillsNeeded: 1 });
ideaSchema.index({ status: 1 });
ideaSchema.index({ mode: 1 });
ideaSchema.index({ difficulty: 1 });
ideaSchema.index({ featured: 1 });
ideaSchema.index({ likes: -1 });
ideaSchema.index({ views: -1 });
ideaSchema.index({ createdAt: -1 });
ideaSchema.index({ teamMembers: 1 });

export const Idea = mongoose.model<IIdea>('Idea', ideaSchema);


