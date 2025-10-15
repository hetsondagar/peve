import mongoose, { Schema, Types } from 'mongoose';

const imageSchema = new Schema(
  {
    url: String,
    publicId: String,
  },
  { _id: false }
);

const collaboratorSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User' },
    role: String,
    contributions: String,
  },
  { _id: false }
);

const metricSchema = new Schema(
  {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
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

const projectSchema = new Schema(
  {
    title: String,
    description: String,
    author: { type: Types.ObjectId, ref: 'User' },
    collaborators: [collaboratorSchema],
    techStack: { type: [String], index: true },
    coverImage: imageSchema,
    screenshots: [imageSchema],
    repoUrl: String,
    liveUrl: String,
    healthScore: { type: Number, default: 0 },
    metrics: { type: metricSchema, default: {} },
    docs: String,
    timeline: [timelineSchema],
  },
  { timestamps: true }
);

projectSchema.index({ author: 1 });

export const Project = mongoose.model('Project', projectSchema);


