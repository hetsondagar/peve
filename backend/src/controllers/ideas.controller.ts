import { Request, Response } from 'express';
import { Idea } from '../models/Idea';
import { User } from '../models/User';
import { Comment } from '../models/Comment';
import { computeCompatibility } from '../services/compatibility';
import { emitToIdea, emitToUser } from '../sockets/bus';
import { BadgeService } from '../services/badgeService';

export async function listIdeas(req: Request, res: Response) {
  try {
    const { 
      page = '1', 
      limit = '20', 
      status, 
      tags, 
      author, 
      sort = 'createdAt',
      difficulty,
      skillsNeeded,
      search
    } = req.query as any;
    
    const q: any = { isPublic: true };
    
    if (status) q.status = status;
    if (author) q.author = author;
    if (tags) q.tags = { $in: String(tags).split(',') };
    if (difficulty) q.difficulty = difficulty;
    if (skillsNeeded) q.skillsNeeded = { $in: String(skillsNeeded).split(',') };
    if (search) {
      q.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    let sortObj: any = { createdAt: -1 };
    if (sort === 'trending') {
      sortObj = { likes: -1, comments: -1, views: -1, createdAt: -1 };
    } else if (sort === 'popular') {
      sortObj = { likes: -1, createdAt: -1 };
    } else if (sort === 'recent') {
      sortObj = { createdAt: -1 };
    }
    
    const cursor = Idea.find(q)
      .populate('author', 'username name avatarUrl skills')
      .populate('collaborators.user', 'username name avatarUrl')
      .sort(sortObj)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
      
    const [items, total] = await Promise.all([cursor, Idea.countDocuments(q)]);
    
    return res.json({ 
      success: true, 
      data: { 
        items, 
        total, 
        page: Number(page), 
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      } 
    });
  } catch (error) {
    console.error('List ideas error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch ideas' });
  }
}

export async function getIdea(req: Request, res: Response) {
  const idea = await Idea.findById(req.params.id).populate('author');
  if (!idea) return res.status(404).json({ success: false, error: 'Not found' });
  return res.json({ success: true, data: idea });
}

export async function createIdea(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    
    const { 
      title, 
      description, 
      tags, 
      brand, 
      mode,
      skillsNeeded,
      difficulty,
      estimatedTime
    } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ success: false, error: 'Title and description are required' });
    }
    
    const idea = await Idea.create({ 
      title, 
      description, 
      tags: tags || [], 
      brand, 
      mode: mode || 'brainstorm',
      skillsNeeded: skillsNeeded || [],
      difficulty: difficulty || 'beginner',
      estimatedTime,
      status: mode === 'want_to_build' ? 'planning' : 'brainstorm', 
      author: userId 
    });
    
    // Update user's stats
    await User.findByIdAndUpdate(userId, {
      $inc: { 'stats.ideasPosted': 1 }
    });
    
    const populatedIdea = await Idea.findById(idea._id)
      .populate('author', 'username name avatarUrl skills');

    // Check for badge awards
    try {
      await BadgeService.checkAndAwardBadges(userId, 'idea_created', (idea._id as any).toString());
    } catch (badgeError) {
      console.error('Error checking badges for idea creation:', badgeError);
    }
    
    return res.status(201).json({ success: true, data: populatedIdea });
  } catch (error) {
    console.error('Create idea error:', error);
    res.status(500).json({ success: false, error: 'Failed to create idea' });
  }
}

export async function joinIdea(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  const { role, message } = req.body;
  const idea = await Idea.findById(req.params.id);
  if (!idea) return res.status(404).json({ success: false, error: 'Not found' });
  idea.requests.push({ user: userId, role, message, status: 'pending', createdAt: new Date() } as any);
  await idea.save();
    emitToUser(String(idea.author), 'idea:join_request', { ideaId: (idea as any)._id.toString() });
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
    emitToUser(String(r.user), 'idea:join_response', { ideaId: (idea as any)._id.toString(), status: r.status });
    emitToIdea(String((idea as any)._id), 'idea:updated', { ideaId: (idea as any)._id.toString() });
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
  try {
    const idea = await Idea.findById(req.params.id).populate('author');
    if (!idea) return res.status(404).json({ success: false, error: 'Not found' });
    const userB = await User.findById(req.query.userId as string);
    if (!userB) return res.status(404).json({ success: false, error: 'User not found' });
    const result = computeCompatibility(
      { skills: (idea.author as any)?.skills as string[], interests: (idea.author as any)?.interests as string[] },
      { skills: userB.skills as string[], interests: userB.interests as string[] },
      { pastCollab: false, similarAvailability: false }
    );
    return res.json({ success: true, data: result });
  } catch (error) {
    console.error('Compatibility error:', error);
    res.status(500).json({ success: false, error: 'Failed to calculate compatibility' });
  }
}

export async function getTrendingIdeas(req: Request, res: Response) {
  try {
    const { limit = '10' } = req.query;
    
    // Get ideas with highest engagement
    const ideas = await Idea.find({ isPublic: true })
      .populate('author', 'username name avatarUrl skills')
      .sort({ 
        likes: -1, 
        views: -1, 
        comments: -1,
        createdAt: -1 
      })
      .limit(Number(limit));
    
    res.json({ success: true, data: ideas });
  } catch (error) {
    console.error('Get trending ideas error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch trending ideas' });
  }
}

export async function bookmarkIdea(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const { ideaId } = req.params;
    
    const idea = await Idea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({ success: false, error: 'Idea not found' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    // Toggle bookmark
    const isBookmarked = user.bookmarkedIdeas.includes(ideaId as any);
    
    if (isBookmarked) {
      await User.findByIdAndUpdate(userId, {
        $pull: { bookmarkedIdeas: ideaId }
      });
    } else {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { bookmarkedIdeas: ideaId }
      });
    }
    
    res.json({ 
      success: true, 
      data: { 
        bookmarked: !isBookmarked,
        message: !isBookmarked ? 'Idea bookmarked' : 'Bookmark removed'
      } 
    });
  } catch (error) {
    console.error('Bookmark idea error:', error);
    res.status(500).json({ success: false, error: 'Failed to bookmark idea' });
  }
}

export async function getIdeaWithComments(req: Request, res: Response) {
  try {
    const idea = await Idea.findById(req.params.id)
      .populate('author', 'username name avatarUrl bio skills')
      .populate('collaborators.user', 'username name avatarUrl skills');
    
    if (!idea) {
      return res.status(404).json({ success: false, error: 'Idea not found' });
    }
    
    // Increment view count
    await Idea.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 }
    });
    
    // Get comments for this idea
    const comments = await Comment.find({
      parentType: 'Idea',
      parentId: req.params.id
    })
      .populate('author', 'username name avatarUrl')
      .sort({ createdAt: -1 })
      .limit(20);
    
    return res.json({ 
      success: true, 
      data: { 
        idea, 
        comments 
      } 
    });
  } catch (error) {
    console.error('Get idea with comments error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch idea' });
  }
}


