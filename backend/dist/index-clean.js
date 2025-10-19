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
const morgan_1 = __importDefault(require("morgan"));
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const MONGO_URI = process.env.MONGO_URI || '';
// Memory optimization
process.setMaxListeners(0);
// Connect to MongoDB
mongoose_1.default.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Security middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false,
}));
// CORS configuration
app.use((0, cors_1.default)({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Body parsing middleware
app.use(express_1.default.json({ limit: '2mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '2mb' }));
app.use((0, morgan_1.default)('combined'));
// Root route
app.get('/', (_req, res) => {
    res.json({
        message: 'peve API Server',
        tagline: 'your peers, your hive',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString()
    });
});
// Health check
app.get('/health', async (_req, res) => {
    const dbState = mongoose_1.default.connection.readyState;
    res.json({
        status: 'ok',
        db: dbState === 1 ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});
// Test endpoint - NO RATE LIMITING
app.get('/test', (_req, res) => {
    res.json({
        message: 'Rate limiting test endpoint - CLEAN VERSION',
        timestamp: new Date().toISOString(),
        status: 'success',
        version: 'clean'
    });
});
// Load routes synchronously
console.log('📦 Loading routes...');
try {
    // Import and mount routes
    const authRoutes = require('./routes/auth.routes');
    const usersRoutes = require('./routes/users.routes');
    const projectsRoutes = require('./routes/projects.routes');
    const ideasRoutes = require('./routes/ideas.routes');
    const commentsRoutes = require('./routes/comments.routes');
    const notificationsRoutes = require('./routes/notifications.routes');
    const searchRoutes = require('./routes/search.routes');
    const likesRoutes = require('./routes/likes.routes');
    const uploadsRoutes = require('./routes/uploads.routes');
    const collaborationsRoutes = require('./routes/collaborations.routes');
    const chatRoutes = require('./routes/chat.routes');
    const compatibilityRoutes = require('./routes/compatibility.routes');
    const collaborationRoutes = require('./routes/collaboration-requests.routes');
    const dashboardRoutes = require('./routes/dashboard.routes');
    const leaderboardRoutes = require('./routes/leaderboard.routes');
    const promptRoutes = require('./routes/prompt.routes');
    const interactionRoutes = require('./routes/interaction.routes');
    const badgeRoutes = require('./routes/badge.routes');
    // Mount routes
    app.use('/api/auth', authRoutes.default);
    app.use('/api/users', usersRoutes.default);
    app.use('/api/projects', projectsRoutes.default);
    app.use('/api/ideas', ideasRoutes.default);
    app.use('/api/comments', commentsRoutes.default);
    app.use('/api/notifications', notificationsRoutes.default);
    app.use('/api/search', searchRoutes.default);
    app.use('/api/likes', likesRoutes.default);
    app.use('/api/uploads', uploadsRoutes.default);
    app.use('/api/collaborations', collaborationsRoutes.default);
    app.use('/api/chat', chatRoutes.default);
    app.use('/api/compatibility', compatibilityRoutes.default);
    app.use('/api/collaboration', collaborationRoutes.default);
    app.use('/api/dashboard', dashboardRoutes.default);
    app.use('/api/leaderboard', leaderboardRoutes.default);
    app.use('/api/prompts', promptRoutes.default);
    app.use('/api/interactions', interactionRoutes.default);
    app.use('/api/badges', badgeRoutes.default);
    console.log('✅ All routes loaded successfully');
}
catch (error) {
    console.error('❌ Error loading routes:', error);
    throw error;
}
// Initialize Socket.IO
console.log('🔌 Initializing Socket.IO...');
const { Server: SocketIOServer } = require('socket.io');
const { registerSocketHandlers } = require('./sockets');
const io = new SocketIOServer(server, {
    cors: { origin: FRONTEND_URL, credentials: true },
});
registerSocketHandlers(io);
console.log('✅ Socket.IO initialized');
// Start server
server.listen(PORT, () => {
    console.log(`🚀 peve-backend API server started successfully!`);
    console.log(`📡 CORS/Socket allowed origin: ${FRONTEND_URL}`);
    console.log(`🌐 Server running on port: ${PORT}`);
    console.log(`🔒 NO RATE LIMITING - CLEAN VERSION`);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
        process.exit(0);
    });
});
process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
        process.exit(0);
    });
});
