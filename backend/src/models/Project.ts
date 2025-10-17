import mongoose, { Schema, Types, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  tagline: string;
  description: string;
  author: Types.ObjectId;
  contributors: {
    user: Types.ObjectId;
    role: string;
    contributions: string;
  }[];
  techStack: string[];
  category: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  developmentStage: 'idea' | 'prototype' | 'ongoing' | 'completed';
  coverImage?: {
    url: string;
    publicId: string;
  };
  screenshots: {
    url: string;
    publicId: string;
  }[];
  keyFeatures: string[];
  links: {
    liveDemo?: string;
    githubRepo: string;
    documentation?: string;
    videoDemo?: string;
  };
  collaboration: {
    openToCollaboration: boolean;
    lookingForRoles: string[];
    teammates: Types.ObjectId[];
  };
  badges: string[];
  visibility: 'public' | 'private' | 'friends-only';
  isDraft: boolean;
  healthScore: number;
  likedBy: Types.ObjectId[];
  metrics: {
    views: number;
    likes: number;
    comments: number;
    saves: number;
    shares: number;
  };
  timeline: {
    title: string;
    desc: string;
    date: Date;
  }[];
  tags: string[];
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const imageSchema = new Schema(
  {
    url: String,
    publicId: String,
  },
  { _id: false }
);

const contributorSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    role: String,
    contributions: String,
  },
  { _id: false }
);

const linksSchema = new Schema(
  {
    liveDemo: String,
    githubRepo: { type: String, required: true },
    documentation: String,
    videoDemo: String,
  },
  { _id: false }
);

const collaborationSchema = new Schema(
  {
    openToCollaboration: { type: Boolean, default: false },
    lookingForRoles: [String],
    teammates: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { _id: false }
);

const metricSchema = new Schema(
  {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
  },
  { _id: false }
);

const timelineSchema = new Schema(
  {
    title: String,
    desc: String,
    date: Date,
  },
  { _id: false }
);

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    contributors: [contributorSchema],
    techStack: { type: [String], default: [] },
    category: { type: String, required: true },
    difficultyLevel: { 
      type: String, 
      enum: ['beginner', 'intermediate', 'advanced'], 
      default: 'beginner' 
    },
    developmentStage: { 
      type: String, 
      enum: ['idea', 'prototype', 'ongoing', 'completed'], 
      default: 'idea' 
    },
    coverImage: imageSchema,
    screenshots: [imageSchema],
    keyFeatures: { type: [String], default: [] },
    links: { type: linksSchema, required: true },
    collaboration: { type: collaborationSchema, default: {} },
    badges: { type: [String], default: [] },
    visibility: { 
      type: String, 
      enum: ['public', 'private', 'friends-only'], 
      default: 'public' 
    },
    isDraft: { type: Boolean, default: false },
    healthScore: { type: Number, default: 0 },
    likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    metrics: { type: metricSchema, default: {} },
    timeline: [timelineSchema],
    tags: { type: [String], default: [] },
    status: { 
      type: String, 
      enum: ['planning', 'in-progress', 'completed', 'on-hold'], 
      default: 'planning' 
    },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

projectSchema.index({ author: 1 });
projectSchema.index({ techStack: 1 });
projectSchema.index({ tags: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ difficultyLevel: 1 });
projectSchema.index({ developmentStage: 1 });
projectSchema.index({ visibility: 1 });
projectSchema.index({ isDraft: 1 });
projectSchema.index({ featured: 1 });
projectSchema.index({ 'metrics.likes': -1 });
projectSchema.index({ 'metrics.views': -1 });
projectSchema.index({ 'metrics.saves': -1 });
projectSchema.index({ createdAt: -1 });

export const Project = mongoose.model<IProject>('Project', projectSchema);


