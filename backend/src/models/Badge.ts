import mongoose, { Schema } from 'mongoose';

const badgeSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    description: String,
    iconUrl: String,
    criteria: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const Badge = mongoose.model('Badge', badgeSchema);


