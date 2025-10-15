import { Request, Response } from 'express';
import { Idea } from '../models/Idea';
import { Project } from '../models/Project';
import { User } from '../models/User';

export async function search(req: Request, res: Response) {
  const { q = '', type = 'all', page = '1', limit = '20' } = req.query as any;
  const rx = new RegExp(String(q), 'i');
  const skip = (Number(page) - 1) * Number(limit);

  const searchIdeas = async () => {
    const items = await Idea.find({ $or: [{ title: rx }, { description: rx }, { tags: rx }] })
      .skip(skip)
      .limit(Number(limit));
    const total = await Idea.countDocuments({ $or: [{ title: rx }, { description: rx }, { tags: rx }] });
    return { items, total };
  };
  const searchProjects = async () => {
    const items = await Project.find({ $or: [{ title: rx }, { description: rx }, { techStack: rx }] })
      .skip(skip)
      .limit(Number(limit));
    const total = await Project.countDocuments({ $or: [{ title: rx }, { description: rx }, { techStack: rx }] });
    return { items, total };
  };
  const searchUsers = async () => {
    const items = await User.find({ $or: [{ name: rx }, { email: rx }, { skills: rx }] })
      .skip(skip)
      .limit(Number(limit));
    const total = await User.countDocuments({ $or: [{ name: rx }, { email: rx }, { skills: rx }] });
    return { items, total };
  };

  let data: any = {};
  if (type === 'ideas') data.ideas = await searchIdeas();
  else if (type === 'projects') data.projects = await searchProjects();
  else if (type === 'users') data.users = await searchUsers();
  else {
    const [ideas, projects, users] = await Promise.all([searchIdeas(), searchProjects(), searchUsers()]);
    data = { ideas, projects, users };
  }
  return res.json({ success: true, data });
}


