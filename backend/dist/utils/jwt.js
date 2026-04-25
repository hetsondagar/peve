"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h'; // Extended to 24 hours
const REFRESH_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d';
// Validate JWT secrets
if (!JWT_SECRET) {
    console.error('❌ JWT_SECRET is not set in environment variables');
    throw new Error('JWT_SECRET is required');
}
if (!JWT_REFRESH_SECRET) {
    console.error('❌ JWT_REFRESH_SECRET is not set in environment variables');
    throw new Error('JWT_REFRESH_SECRET is required');
}
function signAccessToken(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
        issuer: 'peve-api',
        audience: 'peve-client'
    });
}
function signRefreshToken(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: REFRESH_EXPIRES_IN,
        issuer: 'peve-api',
        audience: 'peve-client'
    });
}
function verifyAccessToken(token) {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET, {
        issuer: 'peve-api',
        audience: 'peve-client'
    });
}
function verifyRefreshToken(token) {
    return jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET, {
        issuer: 'peve-api',
        audience: 'peve-client'
    });
}
