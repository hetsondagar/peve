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
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const settingsSchema = new mongoose_1.Schema({
    notifyOnJoin: { type: Boolean, default: true },
    publicProfile: { type: Boolean, default: true },
}, { _id: false });
const userSchema = new mongoose_1.Schema({
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
    badges: [{ type: mongoose_1.Types.ObjectId, ref: 'Badge' }],
    reputation: { type: Number, default: 0 },
    githubId: { type: String },
    lastActiveAt: { type: Date, default: Date.now },
    settings: { type: settingsSchema, default: {} },
}, { timestamps: true });
exports.User = mongoose_1.default.model('User', userSchema);
