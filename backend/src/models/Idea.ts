import mongoose, { Schema, Types } from 'mongoose';

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
    user: { type: Types.ObjectId, ref: 'User' },
    role: String,
    joinedAt: Date,
    accepted: { type: Boolean, default: false },
  },
  { _id: false }
);

const requestSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User' },
    role: String,
    message: String,
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const ideaSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    author: { type: Types.ObjectId, ref: 'User', required: true },
    tags: { type: [String], index: true },
    brand: String,
    status: { type: String, default: 'brainstorm' },
    attachments: [attachmentSchema],
    collaborators: [collaboratorSchema],
    requests: [requestSchema],
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ideaSchema.index({ author: 1 });

export const Idea = mongoose.model('Idea', ideaSchema);


