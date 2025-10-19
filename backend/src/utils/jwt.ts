import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d';

// Validate JWT secrets
if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET is not set in environment variables');
  throw new Error('JWT_SECRET is required');
}
if (!JWT_REFRESH_SECRET) {
  console.error('❌ JWT_REFRESH_SECRET is not set in environment variables');
  throw new Error('JWT_REFRESH_SECRET is required');
}

export function signAccessToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'peve-api',
    audience: 'peve-client'
  } as jwt.SignOptions);
}

export function signRefreshToken(payload: object) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { 
    expiresIn: REFRESH_EXPIRES_IN,
    issuer: 'peve-api',
    audience: 'peve-client'
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, JWT_SECRET, {
    issuer: 'peve-api',
    audience: 'peve-client'
  }) as any;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, JWT_REFRESH_SECRET, {
    issuer: 'peve-api',
    audience: 'peve-client'
  }) as any;
}


