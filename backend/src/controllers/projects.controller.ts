import { Request, Response } from 'express';
import { Project } from '../models/Project';

export async function listProjects(req: Request, res: Response) {
  const { page = '1', limit = '20', tech, author } = req.query as any;
  const q: any = {};
  if (tech) q.techStack = { $in: String(tech).split(',') };
  if (author) q.author = author;
  const cursor = Project.find(q)
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));
  const [items, total] = await Promise.all([cursor, Project.countDocuments(q)]);
  return res.json({ success: true, data: { items, total, page: Number(page), limit: Number(limit) } });
}

export async function getProject(req: Request, res: Response) {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ success: false, error: 'Not found' });
  return res.json({ success: true, data: project });
}

export async function createProject(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
  const project = await Project.create({ ...req.body, author: userId });
  return res.status(201).json({ success: true, data: project });
}

export async function updateProject(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ success: false, error: 'Not found' });
  if (String(project.author) !== String(userId)) return res.status(403).json({ success: false, error: 'Forbidden' });
  Object.assign(project, req.body);
  await project.save();
  return res.json({ success: true, data: project });
}

export async function recalcHealth(req: Request, res: Response) {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ success: false, error: 'Not found' });
  // naive placeholder health score until full rules
  project.healthScore = Math.min(100, Math.max(0, (project.metrics?.likes || 0) + 50));
  await project.save();
  return res.json({ success: true, data: { healthScore: project.healthScore } });
}

export async function forkProject(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ success: false, error: 'Not found' });
  const fork = await Project.create({
    title: project.title + ' (fork)',
    description: project.description,
    author: userId,
    collaborators: [],
    techStack: project.techStack,
    coverImage: project.coverImage,
    screenshots: project.screenshots,
    repoUrl: project.repoUrl,
    liveUrl: project.liveUrl,
    docs: project.docs,
    timeline: project.timeline,
  });
  return res.json({ success: true, data: fork });
}


