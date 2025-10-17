import { Request, Response } from 'express';
import { User } from '../models/User';
import { Idea } from '../models/Idea';
import { Project } from '../models/Project';
import { CollaborationRequest } from '../models/CollaborationRequest';
import { BadgeService } from '../services/badgeService';

export async function getLeaderboard(req: Request, res: Response) {
  try {
    const { type = 'overall', limit = 50 } = req.query;

    // Get all users with their stats
    const users = await User.find({ isActive: true })
      .select('username name avatarUrl stats createdAt')
      .lean();

    // Calculate scores for each user
    const leaderboardData = await Promise.all(
      users.map(async (user: any) => {
        const userId = user._id;

        // Get counts
        const ideasCount = await Idea.countDocuments({ author: userId });
        const projectsCount = await Project.countDocuments({ author: userId });
        
        // Get collaboration stats
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

        // Calculate score based on type
        let score = 0;
        
        if (type === 'overall') {
          // Overall score: ideas (10pts) + projects (50pts) + collaborations (30pts) + connections (10pts)
          score = (ideasCount * 10) + (projectsCount * 50) + (acceptedCollabs * 30) + ((user.stats?.connections || 0) * 10);
        } else if (type === 'ideas') {
          // Ideas score: based on ideas shared and engagement
          const totalLikes = await Idea.aggregate([
            { $match: { author: userId } },
            { $group: { _id: null, totalLikes: { $sum: '$likes' } } }
          ]);
          score = (ideasCount * 10) + (totalLikes[0]?.totalLikes || 0);
        } else if (type === 'projects') {
          // Projects score: based on projects built and engagement
          const totalEngagement = await Project.aggregate([
            { $match: { author: userId } },
            { $group: { _id: null, totalEngagement: { $sum: { $add: ['$metrics.likes', '$metrics.views'] } } } }
          ]);
          score = (projectsCount * 50) + (totalEngagement[0]?.totalEngagement || 0);
        } else if (type === 'collaboration') {
          // Collaboration score: based on successful collaborations
          score = (acceptedCollabs * 30) + (totalCollabs * 5);
        }

        // Check if recently active (last 24 hours)
        const recentlyActive = await checkRecentlyActive(userId);

        // Get user's badges
        const userBadges = await BadgeService.getUserBadges(userId);

        return {
          rank: 0, // Will be set after sorting
          _id: userId,
          username: user.username || user.name,
          name: user.name,
          avatarUrl: user.avatarUrl,
          score: Math.round(score),
          ideasCount,
          projectsCount,
          collabsCount: acceptedCollabs,
          recentlyActive,
          badges: userBadges,
          totalPoints: user.stats?.totalPoints || 0
        };
      })
    );

    // Sort by score and assign ranks
    leaderboardData.sort((a, b) => b.score - a.score);
    leaderboardData.forEach((user, index) => {
      user.rank = index + 1;
    });

    // Apply limit
    const limitedData = leaderboardData.slice(0, Number(limit));

    return res.json({
      success: true,
      data: limitedData
    });

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch leaderboard' });
  }
}

async function checkRecentlyActive(userId: any): Promise<boolean> {
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  const recentActivity = await Promise.all([
    Idea.findOne({ author: userId, createdAt: { $gte: oneDayAgo } }),
    Project.findOne({ author: userId, createdAt: { $gte: oneDayAgo } }),
    CollaborationRequest.findOne({
      $or: [
        { requesterId: userId, createdAt: { $gte: oneDayAgo } },
        { receiverId: userId, createdAt: { $gte: oneDayAgo } }
      ]
    })
  ]);

  return recentActivity.some(activity => activity !== null);
}

async function getUserBadges(userId: any, ideasCount: number, projectsCount: number, collabsCount: number) {
  const badges = [];

  // Top Collaborator
  if (collabsCount >= 10) {
    badges.push({
      name: 'Top Collaborator',
      icon: '🤝',
      description: 'Worked on 10+ projects',
      unlocked: true
    });
  }

  // Idea Bee
  if (ideasCount >= 25) {
    badges.push({
      name: 'Idea Bee',
      icon: '💡',
      description: 'Shared 25+ ideas',
      unlocked: true
    });
  }

  // Project Master
  if (projectsCount >= 5) {
    badges.push({
      name: 'Project Master',
      icon: '🚀',
      description: 'Completed 5 projects',
      unlocked: true
    });
  }

  // Code Wizard (based on total contributions)
  const totalContributions = ideasCount + projectsCount + collabsCount;
  if (totalContributions >= 100) {
    badges.push({
      name: 'Code Wizard',
      icon: '🧙',
      description: '1000+ contributions',
      unlocked: true
    });
  }

  return badges;
}

export async function getUserRank(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    // Get all users with scores
    const users = await User.find({ isActive: true })
      .select('username name avatarUrl stats')
      .lean();

    const userScores = await Promise.all(
      users.map(async (user: any) => {
        const ideasCount = await Idea.countDocuments({ author: user._id });
        const projectsCount = await Project.countDocuments({ author: user._id });
        const acceptedCollabs = await CollaborationRequest.countDocuments({
          $or: [
            { requesterId: user._id, status: 'accepted' },
            { receiverId: user._id, status: 'accepted' }
          ]
        });

        const score = (ideasCount * 10) + (projectsCount * 50) + (acceptedCollabs * 30) + ((user.stats?.connections || 0) * 10);

        return {
          userId: user._id,
          score: Math.round(score)
        };
      })
    );

    // Sort and find user's rank
    userScores.sort((a, b) => b.score - a.score);
    const userRank = userScores.findIndex(u => u.userId.toString() === userId) + 1;

    // Get user's total score
    const userScore = userScores.find(u => u.userId.toString() === userId)?.score || 0;

    return res.json({
      success: true,
      data: {
        rank: userRank,
        score: userScore,
        totalUsers: userScores.length
      }
    });

  } catch (error) {
    console.error('Error fetching user rank:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user rank' });
  }
}

export async function getBadges(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    // Get user's earned badges
    const userBadges = await BadgeService.getUserBadges(userId);

    return res.json({
      success: true,
      data: userBadges
    });

  } catch (error) {
    console.error('Error fetching badges:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch badges' });
  }
}

export async function getAllBadges(req: Request, res: Response) {
  try {
    const badges = await BadgeService.getAllBadges();

    return res.json({
      success: true,
      data: badges
    });

  } catch (error) {
    console.error('Error fetching all badges:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch badges' });
  }
}
