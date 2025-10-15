import mongoose, { Schema, Types } from 'mongoose';

const settingsSchema = new Schema(
  {
    notifyOnJoin: { type: Boolean, default: true },
    publicProfile: { type: Boolean, default: true },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, lowercase: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String },
    avatarUrl: { type: String },
    college: { type: String },
    bio: { type: String },
    role: { type: String, default: 'student' },
    skills: { type: [String], index: true },
    interests: { type: [String], index: true },
    badges: [{ type: Types.ObjectId, ref: 'Badge' }],
    reputation: { type: Number, default: 0 },
    githubId: { type: String },
    lastActiveAt: { type: Date, default: Date.now },
    settings: { type: settingsSchema, default: {} },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);


