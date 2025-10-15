import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { Server as SocketIOServer } from 'socket.io';
import { registerSocketHandlers } from './sockets';
import authRoutes from './routes/auth.routes';
import ideasRoutes from './routes/ideas.routes';
import projectsRoutes from './routes/projects.routes';
import commentsRoutes from './routes/comments.routes';
import notificationsRoutes from './routes/notifications.routes';
import uploadsRoutes from './routes/uploads.routes';
import searchRoutes from './routes/search.routes';
import usersRoutes from './routes/users.routes';

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const MONGO_URI = process.env.MONGO_URI || '';

async function start() {
  if (!MONGO_URI) {
    // eslint-disable-next-line no-console
    console.error('MONGO_URI is not set');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);

  const app = express();
  const server = http.createServer(app);
  const io = new SocketIOServer(server, {
    cors: { origin: FRONTEND_URL, credentials: true },
  });

  app.use(helmet());
  app.use(cors({ origin: FRONTEND_URL, credentials: true }));
  app.use(express.json({ limit: '2mb' }));
  app.use(morgan('dev'));
  app.use(rateLimit({ windowMs: 60_000, max: 100 }));

  app.get('/health', async (_req, res) => {
    const dbState = mongoose.connection.readyState; // 1 connected
    res.json({ status: 'ok', db: dbState === 1 ? 'connected' : 'disconnected' });
  });

  // routes
  app.use('/api/auth', authRoutes);
  app.use('/api/ideas', ideasRoutes);
  app.use('/api/projects', projectsRoutes);
  app.use('/api/comments', commentsRoutes);
  app.use('/api/notifications', notificationsRoutes);
  app.use('/api/uploads', uploadsRoutes);
  app.use('/api/search', searchRoutes);
  app.use('/api/users', usersRoutes);

  registerSocketHandlers(io);

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


