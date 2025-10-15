import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';

export async function signup(req: Request, res: Response) {
  const { username, name, email, password, college, role, skills } = req.body;
  if (!username || !name || !email || !password) return res.status(400).json({ success: false, error: 'Missing fields' });
  const existing = await User.findOne({ $or: [{ email }, { username: String(username).toLowerCase() }] });
  if (existing) return res.status(409).json({ success: false, error: 'Email in use' });
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ username: String(username).toLowerCase(), name, email, passwordHash, college, role, skills });
  const token = signAccessToken({ sub: user._id.toString() });
  const refreshToken = signRefreshToken({ sub: user._id.toString() });
  return res.json({ success: true, data: { token, refreshToken, user } });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.passwordHash) return res.status(401).json({ success: false, error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ success: false, error: 'Invalid credentials' });
  const token = signAccessToken({ sub: user._id.toString() });
  const refreshToken = signRefreshToken({ sub: user._id.toString() });
  return res.json({ success: true, data: { token, refreshToken, user } });
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ success: false, error: 'Missing token' });
  try {
    const payload = verifyRefreshToken(refreshToken);
    const token = signAccessToken({ sub: (payload as any).sub });
    const newRefreshToken = signRefreshToken({ sub: (payload as any).sub });
    return res.json({ success: true, data: { token, refreshToken: newRefreshToken } });
  } catch {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
}

export async function me(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
  const user = await User.findById(userId);
  return res.json({ success: true, data: { user } });
}

export async function logout(_req: Request, res: Response) {
  // If storing refresh tokens, invalidate here. For now client-side delete.
  return res.json({ success: true, data: { loggedOut: true } });
}


