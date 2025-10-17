"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = signup;
exports.login = login;
exports.refresh = refresh;
exports.me = me;
exports.logout = logout;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const jwt_1 = require("../utils/jwt");
async function signup(req, res) {
    const { username, name, email, password, college, role, skills } = req.body;
    if (!username || !name || !email || !password)
        return res.status(400).json({ success: false, error: 'Missing fields' });
    const existing = await User_1.User.findOne({ $or: [{ email }, { username: String(username).toLowerCase() }] });
    if (existing)
        return res.status(409).json({ success: false, error: 'Email in use' });
    const passwordHash = await bcryptjs_1.default.hash(password, 12);
    const user = await User_1.User.create({ username: String(username).toLowerCase(), name, email, passwordHash, college, role, skills });
    const token = (0, jwt_1.signAccessToken)({ sub: user._id.toString() });
    const refreshToken = (0, jwt_1.signRefreshToken)({ sub: user._id.toString() });
    return res.json({ success: true, data: { token, refreshToken, user } });
}
async function login(req, res) {
    const { email, password } = req.body;
    const user = await User_1.User.findOne({ email });
    if (!user || !user.passwordHash)
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
    const ok = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!ok)
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
    const token = (0, jwt_1.signAccessToken)({ sub: user._id.toString() });
    const refreshToken = (0, jwt_1.signRefreshToken)({ sub: user._id.toString() });
    return res.json({ success: true, data: { token, refreshToken, user } });
}
async function refresh(req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken)
        return res.status(400).json({ success: false, error: 'Missing token' });
    try {
        const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
        const token = (0, jwt_1.signAccessToken)({ sub: payload.sub });
        const newRefreshToken = (0, jwt_1.signRefreshToken)({ sub: payload.sub });
        return res.json({ success: true, data: { token, refreshToken: newRefreshToken } });
    }
    catch {
        return res.status(401).json({ success: false, error: 'Invalid token' });
    }
}
async function me(req, res) {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    const user = await User_1.User.findById(userId);
    return res.json({ success: true, data: { user } });
}
async function logout(_req, res) {
    // If storing refresh tokens, invalidate here. For now client-side delete.
    return res.json({ success: true, data: { loggedOut: true } });
}
