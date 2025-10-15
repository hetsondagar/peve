import { Request, Response } from 'express';
import { Idea } from '../models/Idea';
import { User } from '../models/User';
import { computeCompatibility } from '../services/compatibility';
import { emitToIdea, emitToUser } from '../sockets/bus';

export async function listIdeas(req: Request, res: Response) {
  const { page = '1', limit = '20', status, tags, author, sort } = req.query as any;
  const q: any = {};
  if (status) q.status = status;
  if (author) q.author = author;
  if (tags) q.tags = { $in: String(tags).split(',') };
  const cursor = Idea.find(q)
    .sort(sort === 'trending' ? { likes: -1, comments: -1, views: -1 } : { createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));
  const [items, total] = await Promise.all([cursor, Idea.countDocuments(q)]);
  return res.json({ success: true, data: { items, total, page: Number(page), limit: Number(limit) } });
}

export async function getIdea(req: Request, res: Response) {
  const idea = await Idea.findById(req.params.id).populate('author');
  if (!idea) return res.status(404).json({ success: false, error: 'Not found' });
  return res.json({ success: true, data: idea });
}

export async function createIdea(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
  const { title, description, tags, brand, mode } = req.body;
  if (!title) return res.status(400).json({ success: false, error: 'Title required' });
  const idea = await Idea.create({ title, description, tags, brand, status: mode === 'want_to_build' ? 'want_to_build' : 'brainstorm', author: userId });
  return res.status(201).json({ success: true, data: idea });
}

export async function joinIdea(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  const { role, message } = req.body;
  const idea = await Idea.findById(req.params.id);
  if (!idea) return res.status(404).json({ success: false, error: 'Not found' });
  idea.requests.push({ user: userId, role, message, status: 'pending', createdAt: new Date() } as any);
  await idea.save();
  emitToUser(String(idea.author), 'idea:join_request', { ideaId: idea._id.toString() });
  return res.json({ success: true, data: { requestId: idea.requests[idea.requests.length - 1]._id, status: 'pending' } });
}

export async function respondJoin(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  const { action } = req.body as any;
  const idea = await Idea.findById(req.params.id);
  if (!idea) return res.status(404).json({ success: false, error: 'Not found' });
  if (String(idea.author) !== String(userId)) return res.status(403).json({ success: false, error: 'Forbidden' });
  const reqIdx = idea.requests.findIndex((r: any) => String(r._id) === req.params.requestId);
  if (reqIdx === -1) return res.status(404).json({ success: false, error: 'Request not found' });
  const r: any = idea.requests[reqIdx];
  r.status = action === 'accept' ? 'accepted' : 'rejected';
  if (action === 'accept') idea.collaborators.push({ user: r.user, role: r.role, joinedAt: new Date(), accepted: true } as any);
  await idea.save();
  emitToUser(String(r.user), 'idea:join_response', { ideaId: idea._id.toString(), status: r.status });
  emitToIdea(String(idea._id), 'idea:updated', { ideaId: idea._id.toString() });
  return res.json({ success: true, data: { status: r.status } });
}

export async function convertIdea(req: Request, res: Response) {
  // Placeholder; conversion to Project requires Project create – defer for projects endpoints
  return res.status(501).json({ success: false, error: 'Not implemented yet' });
}

export async function likeIdea(req: Request, res: Response) {
  const idea = await Idea.findById(req.params.id);
  if (!idea) return res.status(404).json({ success: false, error: 'Not found' });
  idea.likes = (idea.likes || 0) + 1;
  await idea.save();
  return res.json({ success: true, data: { likes: idea.likes } });
}

export async function compatibility(req: Request, res: Response) {
  const idea = await Idea.findById(req.params.id).populate('author');
  if (!idea) return res.status(404).json({ success: false, error: 'Not found' });
  const userB = await User.findById(req.query.userId as string);
  if (!userB) return res.status(404).json({ success: false, error: 'User not found' });
  const result = computeCompatibility(
    { skills: (idea.author as any)?.skills, interests: (idea.author as any)?.interests },
    { skills: userB.skills, interests: userB.interests },
    { pastCollab: false, similarAvailability: false }
  );
  return res.json({ success: true, data: result });
}


