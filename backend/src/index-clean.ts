import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

function normalizeOrigin(origin: string) {
  return origin.trim().replace(/\/+$/, '');
}

function isAllowedOrigin(origin: string, allowedOrigins: string[]) {
  const normalized = normalizeOrigin(origin);
  if (allowedOrigins.includes(normalized)) return true;

  try {
    const { hostname } = new URL(normalized);
    // Allow Vercel preview domains for this project.
    if (hostname === 'peve-jointhehive.vercel.app') return true;
    if (hostname.startsWith('peve-jointhehive-') && hostname.endsWith('.vercel.app')) return true;
  } catch {
    return false;
  }

  return false;
}

// CORS origins - support multiple origins and always include trusted defaults.
const CORS_ORIGINS = Array.from(
  new Set(
    [
      FRONTEND_URL,
      'https://peve-jointhehive.vercel.app',
      ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : []),
    ]
      .map(normalizeOrigin)
      .filter(Boolean),
  ),
);
const corsOriginHandler: cors.CorsOptions['origin'] = (origin, callback) => {
  // Allow non-browser/server-to-server requests with no Origin header.
  if (!origin) {
    callback(null, true);
    return;
  }

  if (isAllowedOrigin(origin, CORS_ORIGINS)) {
    callback(null, true);
    return;
  }

  console.warn(`Blocked by CORS: ${origin}`);
  callback(null, false);
};
const MONGO_URI = process.env.MONGO_URI || '';

// Memory optimization
process.setMaxListeners(0);

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const app = express();
const server = http.createServer(app);

// Render / Vercel / other reverse proxies send X-Forwarded-For; required for express-rate-limit
app.set('trust proxy', 1);

// Security middleware
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

// CORS configuration
app.use(cors({
  origin: corsOriginHandler,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));
app.options('*', cors({
  origin: corsOriginHandler,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(morgan('combined'));

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
  const dbState = mongoose.connection.readyState;
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
} catch (error) {
  console.error('❌ Error loading routes:', error);
  throw error;
}

// Initialize Socket.IO
console.log('🔌 Initializing Socket.IO...');
const { Server: SocketIOServer } = require('socket.io');
const { registerSocketHandlers } = require('./sockets');

const io = new SocketIOServer(server, {
  cors: { origin: CORS_ORIGINS, credentials: true },
});

registerSocketHandlers(io);
console.log('✅ Socket.IO initialized');

// Start server
server.listen(PORT, () => {
  console.log(`🚀 peve-backend API server started successfully!`);
  console.log(`📡 CORS/Socket allowed origins: ${CORS_ORIGINS.join(', ')}`);
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
