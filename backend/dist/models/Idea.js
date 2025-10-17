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
    user: { type: mongoose_1.Types.ObjectId, ref: 'User' },
    role: String,
    joinedAt: Date,
    accepted: { type: Boolean, default: false },
}, { _id: false });
const requestSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Types.ObjectId, ref: 'User' },
    role: String,
    message: String,
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
}, { _id: true });
const ideaSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: String,
    author: { type: mongoose_1.Types.ObjectId, ref: 'User', required: true },
    tags: { type: [String], index: true },
    brand: String,
    status: { type: String, default: 'brainstorm' },
    attachments: [attachmentSchema],
    collaborators: [collaboratorSchema],
    requests: [requestSchema],
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
}, { timestamps: true });
ideaSchema.index({ author: 1 });
exports.Idea = mongoose_1.default.model('Idea', ideaSchema);
