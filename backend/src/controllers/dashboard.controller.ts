import { Request, Response } from 'express';
import { User } from '../models/User';
import { Idea } from '../models/Idea';
import { Project } from '../models/Project';
import { CollaborationRequest } from '../models/CollaborationRequest';

export async function getDashboardStats(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    // Get user's stats
    const user = await User.findById(userId).select('stats username name');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Get user's ideas count
    const ideasCount = await Idea.countDocuments({ author: userId });

    // Get user's projects count
    const projectsCount = await Project.countDocuments({ author: userId });

    // Get user's connections count (peers connected)
    const connectionsCount = user.followers?.length || 0;

    // Calculate collaboration score based on accepted collaboration requests
    const acceptedCollabs = await CollaborationRequest.countDocuments({
      $or: [
        { requesterId: userId, status: 'accepted' },
        { receiverId: userId, status: 'accepted' }
      ]
    });

    const totalCollabs = await CollaborationRequest.countDocuments({
      $or: [
        { requesterId: userId },
        { receiverId: userId }
      ]
    });

    const collaborationScore = totalCollabs > 0 
      ? Math.round((acceptedCollabs / totalCollabs) * 100)
      : 0;

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentIdeas = await Idea.countDocuments({
      author: userId,
      createdAt: { $gte: sevenDaysAgo }
    });

    const recentProjects = await Project.countDocuments({
      author: userId,
      createdAt: { $gte: sevenDaysAgo }
    });

    // Get weekly activity data
    const weeklyActivity = await getWeeklyActivity(userId);

    // Get trending projects
    const trendingProjects = await Project.find({
      visibility: 'public',
      isDraft: false
    })
      .sort({ 'metrics.likes': -1, 'metrics.views': -1 })
      .limit(5)
      .populate('author', 'username name avatarUrl')
      .select('title tagline author metrics.likes metrics.views coverImage');

    // Get recent ideas
    const recentIdeasList = await Idea.find({
      author: userId,
      isPublic: true
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title description tags likes commentCount createdAt');

    // Get recent projects
    const recentProjectsList = await Project.find({
      author: userId,
      visibility: 'public'
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title tagline techStack metrics.likes metrics.views createdAt');

    return res.json({
      success: true,
      data: {
        stats: {
          ideasShared: ideasCount,
          projectsBuilt: projectsCount,
          peersConnected: connectionsCount,
          collaborationScore: `${collaborationScore}%`,
          recentActivity: {
            ideas: recentIdeas,
            projects: recentProjects
          }
        },
        weeklyActivity,
        trendingProjects,
        recentIdeas: recentIdeasList,
        recentProjects: recentProjectsList
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch dashboard stats' });
  }
}

async function getWeeklyActivity(userId: any) {
  const weeklyData = [];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    
    // Count activities for this day
    const ideasCount = await Idea.countDocuments({
      author: userId,
      createdAt: { $gte: date, $lt: nextDate }
    });
    
    const projectsCount = await Project.countDocuments({
      author: userId,
      createdAt: { $gte: date, $lt: nextDate }
    });
    
    // Calculate score based on activities (ideas = 10 points, projects = 20 points)
    const score = (ideasCount * 10) + (projectsCount * 20);
    
    weeklyData.push({
      day: days[date.getDay() === 0 ? 6 : date.getDay() - 1],
      score: Math.min(score, 100) // Cap at 100
    });
  }
  
  return weeklyData;
}

export async function getUserActivity(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const { period = 'week' } = req.query;

    let startDate = new Date();
    if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (period === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    // Get ideas
    const ideas = await Idea.find({
      author: userId,
      createdAt: { $gte: startDate }
    })
      .sort({ createdAt: -1 })
      .select('title createdAt likes commentCount');

    // Get projects
    const projects = await Project.find({
      author: userId,
      createdAt: { $gte: startDate }
    })
      .sort({ createdAt: -1 })
      .select('title createdAt metrics.likes metrics.views');

    // Get collaboration requests
    const collabRequests = await CollaborationRequest.find({
      $or: [
        { requesterId: userId },
        { receiverId: userId }
      ],
      createdAt: { $gte: startDate }
    })
      .sort({ createdAt: -1 })
      .populate('ideaId', 'title')
      .populate('requesterId', 'username name')
      .populate('receiverId', 'username name')
      .select('status score message createdAt');

    return res.json({
      success: true,
      data: {
        ideas,
        projects,
        collabRequests
      }
    });

  } catch (error) {
    console.error('Error fetching user activity:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user activity' });
  }
}
