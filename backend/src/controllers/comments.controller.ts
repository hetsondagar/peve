import { Request, Response } from 'express';
import { Comment } from '../models/Comment';

export async function createComment(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
  const { parentType, parentId, body, attachments } = req.body;
  const c = await Comment.create({ author: userId, parentType, parentId, body, attachments });
  return res.status(201).json({ success: true, data: c });
}

export async function listComments(req: Request, res: Response) {
  const { parentType, parentId, page = '1', limit = '20' } = req.query as any;
  const q: any = { parentType, parentId };
  const cursor = Comment.find(q)
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));
  const [items, total] = await Promise.all([cursor, Comment.countDocuments(q)]);
  return res.json({ success: true, data: { items, total, page: Number(page), limit: Number(limit) } });
}

export async function updateComment(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  const c = await Comment.findById(req.params.id);
  if (!c) return res.status(404).json({ success: false, error: 'Not found' });
  if (String(c.author) !== String(userId)) return res.status(403).json({ success: false, error: 'Forbidden' });
  c.body = req.body.body ?? c.body;
  await c.save();
  return res.json({ success: true, data: c });
}

export async function deleteComment(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  const c = await Comment.findById(req.params.id);
  if (!c) return res.status(404).json({ success: false, error: 'Not found' });
  if (String(c.author) !== String(userId)) return res.status(403).json({ success: false, error: 'Forbidden' });
  await c.deleteOne();
  return res.json({ success: true, data: { deleted: true } });
}


