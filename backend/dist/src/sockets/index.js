"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSocketHandlers = registerSocketHandlers;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bus_1 = require("./bus");
function registerSocketHandlers(io) {
    (0, bus_1.setIO)(io);
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token)
                return next();
            const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            socket.userId = payload.sub || payload.id;
            next();
        }
        catch (_err) {
            next();
        }
    });
    io.on('connection', (socket) => {
        const userId = socket.userId;
        if (userId)
            socket.join(`user:${userId}`);
        socket.on('join:idea', (ideaId) => socket.join(`idea:${ideaId}`));
        socket.on('leave:idea', (ideaId) => socket.leave(`idea:${ideaId}`));
        socket.on('disconnect', () => {
            // no-op
        });
    });
}
