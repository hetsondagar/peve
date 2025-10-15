import { Router } from 'express';
import { User } from '../models/User';

const router = Router();

router.get('/check-username', async (req, res) => {
  const { username } = req.query as any;
  if (!username) return res.status(400).json({ success: false, error: 'username required' });
  const exists = await User.exists({ username: String(username).toLowerCase() });
  return res.json({ success: true, data: { available: !exists } });
});

export default router;


