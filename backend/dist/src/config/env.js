"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
exports.env = {
    port: Number(process.env.PORT || 4000),
    nodeEnv: process.env.NODE_ENV || 'development',
    mongoUri: process.env.MONGO_URI || '',
    jwtSecret: process.env.JWT_SECRET || 'dev',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
        apiKey: process.env.CLOUDINARY_API_KEY || '',
        apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    },
    sendgridApiKey: process.env.SENDGRID_API_KEY || '',
    github: {
        clientId: process.env.GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    },
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    /** Base URL of peve-ml-service, e.g. https://your-ml.onrender.com (no trailing path). Optional: ML_FETCH_TIMEOUT_MS on process.env for POST timeout (see mlIntelligenceClient). */
    mlServiceUrl: process.env.ML_SERVICE_URL || '',
    /** Sent as X-API-Key; must equal ML service `API_KEY` when that service requires auth. */
    mlServiceApiKey: process.env.ML_SERVICE_API_KEY || '',
};
