import mongoose, { Schema, Types } from 'mongoose';

const commentSchema = new Schema(
  {
    author: { type: Types.ObjectId, ref: 'User', required: true },
    parentType: { type: String, enum: ['idea', 'project'], required: true },
    parentId: { type: Types.ObjectId, required: true },
    body: { type: String, required: true },
    attachments: [{ url: String }],
  },
  { timestamps: true }
);

commentSchema.index({ parentType: 1, parentId: 1 });

export const Comment = mongoose.model('Comment', commentSchema);


