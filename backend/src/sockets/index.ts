import type { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { setIO } from './bus';

export function registerSocketHandlers(io: Server) {
  setIO(io);
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token as string | undefined;
      if (!token) return next();
      const payload = jwt.verify(token, process.env.JWT_SECRET as string) as any;
      (socket as any).userId = payload.sub || payload.id;
      next();
    } catch (_err) {
      next();
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = (socket as any).userId as string | undefined;
    if (userId) socket.join(`user:${userId}`);

    socket.on('join:idea', (ideaId: string) => socket.join(`idea:${ideaId}`));
    socket.on('leave:idea', (ideaId: string) => socket.leave(`idea:${ideaId}`));

    socket.on('disconnect', () => {
      // no-op
    });
  });
}


