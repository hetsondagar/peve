import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const MONGO_URI = process.env.MONGO_URI || '';

// Memory optimization
process.setMaxListeners(0);
if (process.env.NODE_ENV === 'production') {
  // Increase memory limit for production
  process.env.NODE_OPTIONS = '--max-old-space-size=512';
}

async function start() {
  if (!MONGO_URI) {
    // eslint-disable-next-line no-console
    console.error('MONGO_URI is not set');
    process.exit(1);
  }

  // Connect to MongoDB first
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  const app = express();
  const server = http.createServer(app);

  // Enhanced security middleware
  app.use(helmet({
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
  
  app.use(cors({ 
    origin: FRONTEND_URL, 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));
  app.use(morgan('combined'));
  
  // Enhanced rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);
  
  // Stricter rate limiting for auth endpoints
  const authLimiter = rateLimit({
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
    const dbState = mongoose.connection.readyState; // 1 connected
    res.json({ status: 'ok', db: dbState === 1 ? 'connected' : 'disconnected' });
  });

  // Lazy load routes to reduce memory usage
  console.log('📦 Loading routes...');
  
  // Core routes (load first)
  const authRoutes = await import('./routes/auth.routes');
  const usersRoutes = await import('./routes/users.routes');
  const projectsRoutes = await import('./routes/projects.routes');
  const ideasRoutes = await import('./routes/ideas.routes');
  
  app.use('/api/auth', authLimiter, authRoutes.default);
  app.use('/api/users', usersRoutes.default);
  app.use('/api/projects', projectsRoutes.default);
  app.use('/api/ideas', ideasRoutes.default);
  
  // Secondary routes (load after core)
  const commentsRoutes = await import('./routes/comments.routes');
  const notificationsRoutes = await import('./routes/notifications.routes');
  const searchRoutes = await import('./routes/search.routes');
  const likesRoutes = await import('./routes/likes.routes');
  
  app.use('/api/comments', commentsRoutes.default);
  app.use('/api/notifications', notificationsRoutes.default);
  app.use('/api/search', searchRoutes.default);
  app.use('/api/likes', likesRoutes.default);
  
  // Additional routes (load last)
  const uploadsRoutes = await import('./routes/uploads.routes');
  const collaborationsRoutes = await import('./routes/collaborations.routes');
  const chatRoutes = await import('./routes/chat.routes');
  const compatibilityRoutes = await import('./routes/compatibility.routes');
  const collaborationRoutes = await import('./routes/collaboration-requests.routes');
  const dashboardRoutes = await import('./routes/dashboard.routes');
  const leaderboardRoutes = await import('./routes/leaderboard.routes');
  const promptRoutes = await import('./routes/prompt.routes');
  const interactionRoutes = await import('./routes/interaction.routes');
  const badgeRoutes = await import('./routes/badge.routes');
  
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

  console.log('✅ Routes loaded successfully');

  // Initialize Socket.IO (lazy load)
  console.log('🔌 Initializing Socket.IO...');
  const { Server: SocketIOServer } = await import('socket.io');
  const { registerSocketHandlers } = await import('./sockets');
  
  const io = new SocketIOServer(server, {
    cors: { origin: FRONTEND_URL, credentials: true },
  });
  
  registerSocketHandlers(io);
  console.log('✅ Socket.IO initialized');

      server.listen(PORT, () => {
        // eslint-disable-next-line no-console
        console.log(`🚀 peve-backend API server started successfully!`);
        // eslint-disable-next-line no-console
        console.log(`📡 CORS/Socket allowed origin: ${FRONTEND_URL}`);
        // eslint-disable-next-line no-console
        console.log(`🌐 Server running on port: ${PORT}`);
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


