import mongoose, { Schema, Types } from 'mongoose';

const notificationSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', index: true },
    type: { type: String, required: true },
    data: { type: Schema.Types.Mixed },
    read: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Notification = mongoose.model('Notification', notificationSchema);


