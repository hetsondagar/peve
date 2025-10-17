import mongoose, { Schema, Types, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  name: string;
  email: string;
  passwordHash?: string;
  avatarUrl?: string;
  college?: string;
  bio?: string;
  role: string;
  skills: string[];
  interests: string[];
  badges: Types.ObjectId[];
  reputation: number;
  githubId?: string;
  githubUsername?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  discordUsername?: string;
  avatarStyle?: string;
  profileComplete: boolean;
  onboardingCompleted: boolean;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  bookmarkedProjects: Types.ObjectId[];
  bookmarkedIdeas: Types.ObjectId[];
  stats: {
    projectsUploaded: number;
    ideasPosted: number;
    collaborationsJoined: number;
    likesReceived: number;
    totalViews: number;
    totalPoints: number;
  };
  lastActiveAt: Date;
  settings: {
    notifyOnJoin: boolean;
    publicProfile: boolean;
    emailNotifications: boolean;
    darkMode: boolean;
  };
  compatibilitySetupComplete: boolean;
  compatibilityProfile: {
    skills: string[];
    preferredRoles: string[];
    availabilityHours: number;
    timeZone: string;
    preferredWorkHours: string;
    interests: string[];
    goals: string[];
    workStyle: {
      teamPreference: string;
      pace: string;
      communication: string;
      decisionStyle: string;
    };
    lastUpdatedAt: Date;
  };
  collabRequestsSent: Types.ObjectId[];
  collabRequestsReceived: Types.ObjectId[];
  notifications: {
    type: string;
    message: string;
    relatedId: Types.ObjectId;
    seen: boolean;
    createdAt: Date;
  }[];
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const settingsSchema = new Schema(
  {
    notifyOnJoin: { type: Boolean, default: true },
    publicProfile: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: true },
    darkMode: { type: Boolean, default: true },
  },
  { _id: false }
);

const workStyleSchema = new Schema(
  {
    teamPreference: { 
      type: String, 
      enum: ['collaborative', 'independent', 'mixed'], 
      default: 'collaborative' 
    },
    pace: { 
      type: String, 
      enum: ['fast', 'structured', 'slow-steady'], 
      default: 'structured' 
    },
    communication: { 
      type: String, 
      enum: ['frequent-checkins', 'asynchronous', 'minimal'], 
      default: 'asynchronous' 
    },
    decisionStyle: { 
      type: String, 
      enum: ['consensus', 'owner-driven', 'data-driven'], 
      default: 'consensus' 
    },
  },
  { _id: false }
);

const compatibilityProfileSchema = new Schema(
  {
    skills: { type: [String], default: [] },
    preferredRoles: { type: [String], default: [] },
    availabilityHours: { type: Number, default: 0, min: 0, max: 168 },
    timeZone: { type: String, default: 'UTC' },
    preferredWorkHours: { 
      type: String, 
      enum: ['morning', 'afternoon', 'evening', 'flexible'], 
      default: 'flexible' 
    },
    interests: { type: [String], default: [] },
    goals: { type: [String], default: [] },
    workStyle: { type: workStyleSchema, default: {} },
    lastUpdatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const notificationSchema = new Schema(
  {
    type: { type: String, required: true },
    message: { type: String, required: true },
    relatedId: { type: Schema.Types.ObjectId, required: true },
    seen: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const statsSchema = new Schema(
  {
    projectsUploaded: { type: Number, default: 0 },
    ideasPosted: { type: Number, default: 0 },
    collaborationsJoined: { type: Number, default: 0 },
    likesReceived: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    username: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      index: true,
      minlength: [3, 'Username must be at least 3 characters long'],
      maxlength: [20, 'Username cannot exceed 20 characters'],
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String },
    avatarUrl: { type: String },
    college: { type: String },
    bio: { type: String },
    role: { type: String, default: 'student' },
    skills: { type: [String] },
    interests: { type: [String] },
    badges: [{ type: Types.ObjectId, ref: 'Badge' }],
    reputation: { type: Number, default: 0 },
    githubId: { type: String },
    githubUsername: { type: String },
    linkedinUrl: { type: String },
    portfolioUrl: { type: String },
    discordUsername: { type: String },
    avatarStyle: { type: String, default: 'botttsNeutral' },
    profileComplete: { type: Boolean, default: false },
    onboardingCompleted: { type: Boolean, default: false },
    followers: [{ type: Types.ObjectId, ref: 'User' }],
    following: [{ type: Types.ObjectId, ref: 'User' }],
    bookmarkedProjects: [{ type: Types.ObjectId, ref: 'Project' }],
    bookmarkedIdeas: [{ type: Types.ObjectId, ref: 'Idea' }],
    stats: { type: statsSchema, default: {} },
    lastActiveAt: { type: Date, default: Date.now },
    settings: { type: settingsSchema, default: {} },
    compatibilitySetupComplete: { type: Boolean, default: false },
    compatibilityProfile: { type: compatibilityProfileSchema, default: {} },
    collabRequestsSent: [{ type: Schema.Types.ObjectId, ref: 'CollaborationRequest' }],
    collabRequestsReceived: [{ type: Schema.Types.ObjectId, ref: 'CollaborationRequest' }],
    notifications: [notificationSchema],
  },
  { timestamps: true }
);

// Password hashing middleware
userSchema.pre('save', async function (next) {
  if (this.isModified('passwordHash') && this.passwordHash) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  }
  next();
});

// Password comparison method
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Indexes (removed duplicates - email and username already have unique: true in schema)
userSchema.index({ skills: 1 });
userSchema.index({ interests: 1 });
userSchema.index({ lastActiveAt: -1 });
userSchema.index({ 'stats.reputation': -1 });
userSchema.index({ 'stats.projectsUploaded': -1 });
userSchema.index({ followers: 1 });
userSchema.index({ following: 1 });

export const User = mongoose.model<IUser>('User', userSchema);









