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
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const MONGO_URI = process.env.MONGO_URI || '';
// Memory optimization
process.setMaxListeners(0);
if (process.env.NODE_ENV === 'production') {
    // Conservative memory limit for Render free tier
    process.env.NODE_OPTIONS = '--max-old-space-size=256 --optimize-for-size';
}
async function start() {
    if (!MONGO_URI) {
        // eslint-disable-next-line no-console
        console.error('MONGO_URI is not set');
        process.exit(1);
    }
    // Connect to MongoDB first
    await mongoose_1.default.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
    const app = (0, express_1.default)();
    const server = http_1.default.createServer(app);
    // Enhanced security middleware
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
    app.use((0, cors_1.default)({
        origin: FRONTEND_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));
    app.use(express_1.default.json({ limit: '2mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '2mb' }));
    app.use((0, morgan_1.default)('combined'));
    // Enhanced rate limiting
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message: 'Too many requests from this IP, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use(limiter);
    // Stricter rate limiting for auth endpoints
    const authLimiter = (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5, // limit each IP to 5 requests per windowMs
        message: 'Too many authentication attempts, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
    });
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
    // Lazy load routes to reduce memory usage
    console.log('📦 Loading essential routes...');
    // Load only essential routes first
    const authRoutes = await Promise.resolve().then(() => __importStar(require('./routes/auth.routes')));
    app.use('/api/auth', authLimiter, authRoutes.default);
    console.log('✅ Auth routes loaded');
    const usersRoutes = await Promise.resolve().then(() => __importStar(require('./routes/users.routes')));
    app.use('/api/users', usersRoutes.default);
    console.log('✅ Users routes loaded');
    const projectsRoutes = await Promise.resolve().then(() => __importStar(require('./routes/projects.routes')));
    app.use('/api/projects', projectsRoutes.default);
    console.log('✅ Projects routes loaded');
    const ideasRoutes = await Promise.resolve().then(() => __importStar(require('./routes/ideas.routes')));
    app.use('/api/ideas', ideasRoutes.default);
    console.log('✅ Ideas routes loaded');
    // Load remaining routes in background
    setTimeout(async () => {
        try {
            console.log('📦 Loading secondary routes...');
            const commentsRoutes = await Promise.resolve().then(() => __importStar(require('./routes/comments.routes')));
            const notificationsRoutes = await Promise.resolve().then(() => __importStar(require('./routes/notifications.routes')));
            const searchRoutes = await Promise.resolve().then(() => __importStar(require('./routes/search.routes')));
            const likesRoutes = await Promise.resolve().then(() => __importStar(require('./routes/likes.routes')));
            app.use('/api/comments', commentsRoutes.default);
            app.use('/api/notifications', notificationsRoutes.default);
            app.use('/api/search', searchRoutes.default);
            app.use('/api/likes', likesRoutes.default);
            console.log('✅ Secondary routes loaded');
            // Load additional routes after a delay
            setTimeout(async () => {
                try {
                    console.log('📦 Loading additional routes...');
                    const uploadsRoutes = await Promise.resolve().then(() => __importStar(require('./routes/uploads.routes')));
                    const collaborationsRoutes = await Promise.resolve().then(() => __importStar(require('./routes/collaborations.routes')));
                    const chatRoutes = await Promise.resolve().then(() => __importStar(require('./routes/chat.routes')));
                    const compatibilityRoutes = await Promise.resolve().then(() => __importStar(require('./routes/compatibility.routes')));
                    const collaborationRoutes = await Promise.resolve().then(() => __importStar(require('./routes/collaboration-requests.routes')));
                    const dashboardRoutes = await Promise.resolve().then(() => __importStar(require('./routes/dashboard.routes')));
                    const leaderboardRoutes = await Promise.resolve().then(() => __importStar(require('./routes/leaderboard.routes')));
                    const promptRoutes = await Promise.resolve().then(() => __importStar(require('./routes/prompt.routes')));
                    const interactionRoutes = await Promise.resolve().then(() => __importStar(require('./routes/interaction.routes')));
                    const badgeRoutes = await Promise.resolve().then(() => __importStar(require('./routes/badge.routes')));
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
                    console.error('❌ Error loading additional routes:', error);
                }
            }, 2000); // 2 second delay
        }
        catch (error) {
            console.error('❌ Error loading secondary routes:', error);
        }
    }, 1000); // 1 second delay
    // Initialize Socket.IO after a delay to reduce startup memory
    setTimeout(async () => {
        try {
            console.log('🔌 Initializing Socket.IO...');
            const { Server: SocketIOServer } = await Promise.resolve().then(() => __importStar(require('socket.io')));
            const { registerSocketHandlers } = await Promise.resolve().then(() => __importStar(require('./sockets')));
            const io = new SocketIOServer(server, {
                cors: { origin: FRONTEND_URL, credentials: true },
            });
            registerSocketHandlers(io);
            console.log('✅ Socket.IO initialized');
        }
        catch (error) {
            console.error('❌ Error initializing Socket.IO:', error);
        }
    }, 3000); // 3 second delay
    server.listen(PORT, () => {
        // eslint-disable-next-line no-console
        console.log(`API listening on http://localhost:${PORT}`);
        // eslint-disable-next-line no-console
        console.log(`CORS/Socket allowed origin: ${FRONTEND_URL}`);
    });
}
// Memory monitoring
if (process.env.NODE_ENV === 'production') {
    setInterval(() => {
        const used = process.memoryUsage();
        console.log(`Memory Usage: RSS=${Math.round(used.rss / 1024 / 1024)}MB, Heap=${Math.round(used.heapUsed / 1024 / 1024)}MB`);
    }, 30000); // Log every 30 seconds
}
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});
start().catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', err);
    process.exit(1);
});
