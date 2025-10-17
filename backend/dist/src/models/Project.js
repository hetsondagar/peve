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
exports.Project = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const imageSchema = new mongoose_1.Schema({
    url: String,
    publicId: String,
}, { _id: false });
const contributorSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    role: String,
    contributions: String,
}, { _id: false });
const linksSchema = new mongoose_1.Schema({
    liveDemo: String,
    githubRepo: { type: String, required: true },
    documentation: String,
    videoDemo: String,
}, { _id: false });
const collaborationSchema = new mongoose_1.Schema({
    openToCollaboration: { type: Boolean, default: false },
    lookingForRoles: [String],
    teammates: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
}, { _id: false });
const metricSchema = new mongoose_1.Schema({
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    stars: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
}, { _id: false });
const timelineSchema = new mongoose_1.Schema({
    title: String,
    desc: String,
    date: Date,
}, { _id: false });
const projectSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    contributors: [contributorSchema],
    techStack: { type: [String], default: [] },
    category: { type: String, required: true },
    difficultyLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    developmentStage: {
        type: String,
        enum: ['idea', 'prototype', 'ongoing', 'completed'],
        default: 'idea'
    },
    coverImage: imageSchema,
    screenshots: [imageSchema],
    keyFeatures: { type: [String], default: [] },
    links: { type: linksSchema, required: true },
    collaboration: { type: collaborationSchema, default: {} },
    badges: { type: [String], default: [] },
    visibility: {
        type: String,
        enum: ['public', 'private', 'friends-only'],
        default: 'public'
    },
    isDraft: { type: Boolean, default: false },
    healthScore: { type: Number, default: 0 },
    likedBy: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    metrics: { type: metricSchema, default: {} },
    timeline: [timelineSchema],
    tags: { type: [String], default: [] },
    status: {
        type: String,
        enum: ['planning', 'in-progress', 'completed', 'on-hold'],
        default: 'planning'
    },
    featured: { type: Boolean, default: false },
}, { timestamps: true });
projectSchema.index({ author: 1 });
projectSchema.index({ techStack: 1 });
projectSchema.index({ tags: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ difficultyLevel: 1 });
projectSchema.index({ developmentStage: 1 });
projectSchema.index({ visibility: 1 });
projectSchema.index({ isDraft: 1 });
projectSchema.index({ featured: 1 });
projectSchema.index({ 'metrics.likes': -1 });
projectSchema.index({ 'metrics.views': -1 });
projectSchema.index({ 'metrics.saves': -1 });
projectSchema.index({ createdAt: -1 });
exports.Project = mongoose_1.default.model('Project', projectSchema);
