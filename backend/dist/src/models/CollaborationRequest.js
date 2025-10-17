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
exports.CollaborationRequest = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const collaborationRequestSchema = new mongoose_1.Schema({
    ideaId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Idea',
        required: true,
        index: true
    },
    requesterId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    receiverId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    compatibilityScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    message: {
        type: String,
        maxlength: 500
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
        index: true
    }
}, { timestamps: true });
// Compound indexes for efficient queries
collaborationRequestSchema.index({ requesterId: 1, status: 1 });
collaborationRequestSchema.index({ receiverId: 1, status: 1 });
collaborationRequestSchema.index({ ideaId: 1, requesterId: 1 }, { unique: true }); // Prevent duplicate requests
exports.CollaborationRequest = mongoose_1.default.model('CollaborationRequest', collaborationRequestSchema);
