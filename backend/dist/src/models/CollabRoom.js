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
exports.CollabRoom = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const collabRoomSchema = new mongoose_1.Schema({
    ideaId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Idea' },
    projectId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project' },
    name: { type: String, required: true },
    description: { type: String },
    members: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    admins: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    isActive: { type: Boolean, default: true },
    settings: {
        allowFileSharing: { type: Boolean, default: true },
        allowVoiceChat: { type: Boolean, default: false },
        maxMembers: { type: Number, default: 10 }
    },
    pinnedMessages: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'ChatMessage' }],
    lastActivity: { type: Date, default: Date.now },
}, { timestamps: true });
collabRoomSchema.index({ ideaId: 1 }, { unique: true, sparse: true });
collabRoomSchema.index({ projectId: 1 }, { unique: true, sparse: true });
collabRoomSchema.index({ members: 1 });
collabRoomSchema.index({ lastActivity: -1 });
exports.CollabRoom = mongoose_1.default.model('CollabRoom', collabRoomSchema);
