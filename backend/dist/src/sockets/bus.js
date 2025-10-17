"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setIO = setIO;
exports.getIO = getIO;
exports.emitToUser = emitToUser;
exports.emitToIdea = emitToIdea;
let ioRef = null;
function setIO(io) {
    ioRef = io;
}
function getIO() {
    if (!ioRef)
        throw new Error('Socket.io not initialized');
    return ioRef;
}
function emitToUser(userId, event, payload) {
    if (!ioRef)
        return;
    ioRef.to(`user:${userId}`).emit(event, payload);
}
function emitToIdea(ideaId, event, payload) {
    if (!ioRef)
        return;
    ioRef.to(`idea:${ideaId}`).emit(event, payload);
}
