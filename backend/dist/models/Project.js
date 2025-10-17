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
const collaboratorSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Types.ObjectId, ref: 'User' },
    role: String,
    contributions: String,
}, { _id: false });
const metricSchema = new mongoose_1.Schema({
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
}, { _id: false });
const timelineSchema = new mongoose_1.Schema({
    title: String,
    desc: String,
    date: Date,
}, { _id: false });
const projectSchema = new mongoose_1.Schema({
    title: String,
    description: String,
    author: { type: mongoose_1.Types.ObjectId, ref: 'User' },
    collaborators: [collaboratorSchema],
    techStack: { type: [String], index: true },
    coverImage: imageSchema,
    screenshots: [imageSchema],
    repoUrl: String,
    liveUrl: String,
    healthScore: { type: Number, default: 0 },
    metrics: { type: metricSchema, default: {} },
    docs: String,
    timeline: [timelineSchema],
}, { timestamps: true });
projectSchema.index({ author: 1 });
exports.Project = mongoose_1.default.model('Project', projectSchema);
