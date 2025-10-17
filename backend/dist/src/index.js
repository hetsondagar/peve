"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const morgan_1 = __importDefault(require("morgan"));
const socket_io_1 = require("socket.io");
const sockets_1 = require("./sockets");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const ideas_routes_1 = __importDefault(require("./routes/ideas.routes"));
const projects_routes_1 = __importDefault(require("./routes/projects.routes"));
const comments_routes_1 = __importDefault(require("./routes/comments.routes"));
const notifications_routes_1 = __importDefault(require("./routes/notifications.routes"));
const uploads_routes_1 = __importDefault(require("./routes/uploads.routes"));
const search_routes_1 = __importDefault(require("./routes/search.routes"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const collaborations_routes_1 = __importDefault(require("./routes/collaborations.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const compatibility_routes_1 = __importDefault(require("./routes/compatibility.routes"));
const collaboration_requests_routes_1 = __importDefault(require("./routes/collaboration-requests.routes"));
const likes_routes_1 = __importDefault(require("./routes/likes.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const leaderboard_routes_1 = __importDefault(require("./routes/leaderboard.routes"));
const prompt_routes_1 = __importDefault(require("./routes/prompt.routes"));
const interaction_routes_1 = __importDefault(require("./routes/interaction.routes"));
const badge_routes_1 = __importDefault(require("./routes/badge.routes"));
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const MONGO_URI = process.env.MONGO_URI || '';
async function start() {
    if (!MONGO_URI) {
        // eslint-disable-next-line no-console
        console.error('MONGO_URI is not set');
        process.exit(1);
    }
    await mongoose_1.default.connect(MONGO_URI);
    const app = (0, express_1.default)();
    const server = http_1.default.createServer(app);
    const io = new socket_io_1.Server(server, {
        cors: { origin: FRONTEND_URL, credentials: true },
    });
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({ origin: FRONTEND_URL, credentials: true }));
    app.use(express_1.default.json({ limit: '2mb' }));
    app.use((0, morgan_1.default)('dev'));
    app.use((0, express_rate_limit_1.default)({ windowMs: 60000, max: 100 }));
    // Root route
    app.get('/', (_req, res) => {
        res.json({
            message: 'peve API Server',
            tagline: 'your peers, your hive',
            version: '1.0.0',
            endpoints: {
                health: '/health',
                auth: '/api/auth',
                users: '/api/users',
                ideas: '/api/ideas',
                projects: '/api/projects',
                comments: '/api/comments',
                notifications: '/api/notifications',
                uploads: '/api/uploads',
                search: '/api/search',
                collaborations: '/api/collaborations',
                chat: '/api/chat',
                compatibility: '/api/compatibility',
                collaboration: '/api/collaboration',
                likes: '/api/likes',
                dashboard: '/api/dashboard',
                leaderboard: '/api/leaderboard',
                badges: '/api/badges'
            },
            documentation: 'See README.md for API documentation'
        });
    });
    app.get('/health', async (_req, res) => {
        const dbState = mongoose_1.default.connection.readyState; // 1 connected
        res.json({ status: 'ok', db: dbState === 1 ? 'connected' : 'disconnected' });
    });
    // routes
    app.use('/api/auth', auth_routes_1.default);
    app.use('/api/ideas', ideas_routes_1.default);
    app.use('/api/projects', projects_routes_1.default);
    app.use('/api/comments', comments_routes_1.default);
    app.use('/api/notifications', notifications_routes_1.default);
    app.use('/api/uploads', uploads_routes_1.default);
    app.use('/api/search', search_routes_1.default);
    app.use('/api/users', users_routes_1.default);
    app.use('/api/collaborations', collaborations_routes_1.default);
    app.use('/api/chat', chat_routes_1.default);
    app.use('/api/compatibility', compatibility_routes_1.default);
    app.use('/api/collaboration', collaboration_requests_routes_1.default);
    app.use('/api/likes', likes_routes_1.default);
    app.use('/api/dashboard', dashboard_routes_1.default);
    app.use('/api/leaderboard', leaderboard_routes_1.default);
    app.use('/api/prompts', prompt_routes_1.default);
    app.use('/api/interactions', interaction_routes_1.default);
    app.use('/api/badges', badge_routes_1.default);
    (0, sockets_1.registerSocketHandlers)(io);
    server.listen(PORT, () => {
        // eslint-disable-next-line no-console
        console.log(`API listening on http://localhost:${PORT}`);
        // eslint-disable-next-line no-console
        console.log(`CORS/Socket allowed origin: ${FRONTEND_URL}`);
    });
}
start().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
});
