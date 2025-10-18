"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const settingsSchema = new mongoose_1.Schema({
    notifyOnJoin: { type: Boolean, default: true },
    publicProfile: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: true },
    darkMode: { type: Boolean, default: true },
}, { _id: false });
const workStyleSchema = new mongoose_1.Schema({
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
}, { _id: false });
const compatibilityProfileSchema = new mongoose_1.Schema({
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
}, { _id: false });
const notificationSchema = new mongoose_1.Schema({
    type: { type: String, required: true },
    message: { type: String, required: true },
    relatedId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    seen: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
}, { _id: false });
const statsSchema = new mongoose_1.Schema({
    projectsUploaded: { type: Number, default: 0 },
    ideasPosted: { type: Number, default: 0 },
    collaborationsJoined: { type: Number, default: 0 },
    likesReceived: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
}, { _id: false });
const userSchema = new mongoose_1.Schema({
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
    badges: [{ type: mongoose_1.Types.ObjectId, ref: 'Badge' }],
    reputation: { type: Number, default: 0 },
    githubId: { type: String },
    githubUsername: { type: String },
    linkedinUrl: { type: String },
    portfolioUrl: { type: String },
    discordUsername: { type: String },
    avatarStyle: { type: String, default: 'botttsNeutral' },
    profileComplete: { type: Boolean, default: false },
    onboardingCompleted: { type: Boolean, default: false },
    followers: [{ type: mongoose_1.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose_1.Types.ObjectId, ref: 'User' }],
    bookmarkedProjects: [{ type: mongoose_1.Types.ObjectId, ref: 'Project' }],
    bookmarkedIdeas: [{ type: mongoose_1.Types.ObjectId, ref: 'Idea' }],
    stats: { type: statsSchema, default: {} },
    lastActiveAt: { type: Date, default: Date.now },
    settings: { type: settingsSchema, default: {} },
    compatibilitySetupComplete: { type: Boolean, default: false },
    compatibilityProfile: { type: compatibilityProfileSchema, default: {} },
    collabRequestsSent: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'CollaborationRequest' }],
    collabRequestsReceived: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'CollaborationRequest' }],
    notifications: [notificationSchema],
}, { timestamps: true });
// Password hashing middleware
userSchema.pre('save', async function (next) {
    if (this.isModified('passwordHash') && this.passwordHash) {
        this.passwordHash = await bcryptjs_1.default.hash(this.passwordHash, 12);
    }
    next();
});
// Password comparison method
userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.passwordHash)
        return false;
    return bcryptjs_1.default.compare(candidatePassword, this.passwordHash);
};
// Indexes (removed duplicates - email and username already have unique: true in schema)
userSchema.index({ skills: 1 });
userSchema.index({ interests: 1 });
userSchema.index({ lastActiveAt: -1 });
userSchema.index({ 'stats.reputation': -1 });
userSchema.index({ 'stats.projectsUploaded': -1 });
userSchema.index({ followers: 1 });
userSchema.index({ following: 1 });
exports.User = mongoose_1.default.model('User', userSchema);
