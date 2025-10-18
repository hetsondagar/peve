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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Idea = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const attachmentSchema = new mongoose_1.Schema({
    url: String,
    publicId: String,
    type: String,
}, { _id: false });
const collaboratorSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    role: String,
    joinedAt: Date,
    accepted: { type: Boolean, default: false },
}, { _id: false });
const requestSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    role: String,
    message: String,
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
}, { _id: true });
const collabRequestSchema = new mongoose_1.Schema({
    requesterId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    score: { type: Number, min: 0, max: 100 },
    message: String,
}, { _id: false });
const ideaSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    tags: { type: [String] },
    brand: String,
    mode: {
        type: String,
        enum: ['brainstorm', 'want_to_build'],
        default: 'brainstorm'
    },
    status: {
        type: String,
        enum: ['brainstorm', 'planning', 'in-progress', 'completed', 'on-hold'],
        default: 'brainstorm'
    },
    attachments: [attachmentSchema],
    collaborators: [collaboratorSchema],
    requests: [requestSchema],
    collabRequests: [collabRequestSchema],
    teamMembers: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    views: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    saveCount: { type: Number, default: 0 },
    skillsNeeded: { type: [String] },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    estimatedTime: String,
    isPublic: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
}, { timestamps: true });
ideaSchema.index({ author: 1 });
ideaSchema.index({ tags: 1 });
ideaSchema.index({ skillsNeeded: 1 });
ideaSchema.index({ status: 1 });
ideaSchema.index({ mode: 1 });
ideaSchema.index({ difficulty: 1 });
ideaSchema.index({ featured: 1 });
ideaSchema.index({ likes: -1 });
ideaSchema.index({ views: -1 });
ideaSchema.index({ createdAt: -1 });
ideaSchema.index({ teamMembers: 1 });
exports.Idea = mongoose_1.default.model('Idea', ideaSchema);
