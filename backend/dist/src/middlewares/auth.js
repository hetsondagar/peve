"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jwt_1 = require("../utils/jwt");
function requireAuth(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : undefined;
    if (!token)
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    try {
        const payload = (0, jwt_1.verifyAccessToken)(token);
        req.user = { id: payload.sub || payload.id };
        next();
    }
    catch (err) {
        return res.status(401).json({ success: false, error: 'Invalid token' });
    }
}
