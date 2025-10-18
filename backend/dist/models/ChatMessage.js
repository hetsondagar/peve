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
exports.ChatMessage = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const chatMessageSchema = new mongoose_1.Schema({
    roomId: { type: String, required: true, index: true },
    sender: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    messageType: {
        type: String,
        enum: ['text', 'file', 'system'],
        default: 'text'
    },
    attachments: [{
            filename: { type: String },
            url: { type: String },
            type: { type: String },
            size: { type: Number }
        }],
    replyTo: { type: mongoose_1.Schema.Types.ObjectId, ref: 'ChatMessage' },
    isPinned: { type: Boolean, default: false },
    reactions: [{
            emoji: { type: String },
            users: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }]
        }],
}, { timestamps: true });
chatMessageSchema.index({ roomId: 1, createdAt: -1 });
chatMessageSchema.index({ sender: 1 });
chatMessageSchema.index({ isPinned: 1 });
exports.ChatMessage = mongoose_1.default.model('ChatMessage', chatMessageSchema);
