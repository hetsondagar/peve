import { Request, Response } from 'express';
import { Notification } from '../models/Notification';

export async function listNotifications(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  const { page = '1', limit = '20' } = req.query as any;
  const q = { user: userId };
  const cursor = Notification.find(q)
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));
  const [items, total] = await Promise.all([cursor, Notification.countDocuments(q)]);
  return res.json({ success: true, data: { items, total, page: Number(page), limit: Number(limit) } });
}

export async function markRead(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  const { ids } = req.body as any;
  if (Array.isArray(ids) && ids.length > 0) {
    await Notification.updateMany({ _id: { $in: ids }, user: userId }, { $set: { read: true } });
  } else {
    await Notification.updateMany({ user: userId }, { $set: { read: true } });
  }
  return res.json({ success: true, data: { updated: true } });
}


