import type { Server } from 'socket.io';

let ioRef: Server | null = null;

export function setIO(io: Server) {
  ioRef = io;
}

export function getIO(): Server {
  if (!ioRef) throw new Error('Socket.io not initialized');
  return ioRef;
}

export function emitToUser(userId: string, event: string, payload: any) {
  if (!ioRef) return;
  ioRef.to(`user:${userId}`).emit(event, payload);
}

export function emitToIdea(ideaId: string, event: string, payload: any) {
  if (!ioRef) return;
  ioRef.to(`idea:${ideaId}`).emit(event, payload);
}


