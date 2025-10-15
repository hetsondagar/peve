import mongoose, { Schema, Types } from 'mongoose';

const statSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', index: true },
    type: { type: String, required: true },
    value: { type: Number, default: 0 },
    period: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Stat = mongoose.model('Stat', statSchema);


