import { User } from '../models/User';
import { Badge } from '../models/Badge';
import { UserBadge } from '../models/UserBadge';
import { Project } from '../models/Project';
import { Idea } from '../models/Idea';
import { Comment } from '../models/Comment';
import { Like } from '../models/Like';
import { Save } from '../models/Save';
import { Vote } from '../models/Vote';
import { CollaborationRequest } from '../models/CollaborationRequest';
import { Notification } from '../models/Notification';

export class BadgeService {
  /**
   * Check and award badges for a user
   */
  static async checkAndAwardBadges(userId: string, action: string, targetId?: string) {
    try {
      const user = await User.findById(userId);
      if (!user) return;

      // Get all active badges
      const badges = await Badge.find({ isActive: true });
      
      // Get user's current stats
      const userStats = await this.getUserStats(userId);
      
      // Get user's existing badges
      const existingBadges = await UserBadge.find({ userId }).populate('badgeId');
      const existingBadgeKeys = existingBadges.map(ub => (ub.badgeId as any).key);

      const newBadges = [];

      for (const badge of badges) {
        // Skip if user already has this badge
        if (existingBadgeKeys.includes(badge.key)) continue;

        // Check if user qualifies for this badge
        const qualifies = await this.checkBadgeCriteria(badge, userStats, userId, action, targetId);
        
        if (qualifies) {
          // Award the badge
          const userBadge = await UserBadge.create({
            userId,
            badgeId: badge._id,
            earnedAt: new Date(),
            pointsAwarded: badge.points,
            isDisplayed: true
          });

          // Update user's total points
          await User.findByIdAndUpdate(userId, {
            $inc: { 'stats.totalPoints': badge.points }
          });

          // Create notification
          await this.createBadgeNotification(userId, badge);

          newBadges.push({
            badge: badge.toObject(),
            userBadge: userBadge.toObject()
          });

          console.log(`Awarded badge "${badge.name}" to user ${userId}`);
        }
      }

      return newBadges;
    } catch (error) {
      console.error('Error checking and awarding badges:', error);
      return [];
    }
  }

  /**
   * Get comprehensive user stats for badge checking
   */
  static async getUserStats(userId: string) {
    const [
      projectsCount,
      ideasCount,
      commentsCount,
      likesReceived,
      savesReceived,
      votesCount,
      collaborationsCount,
      user
    ] = await Promise.all([
      Project.countDocuments({ author: userId }),
      Idea.countDocuments({ author: userId }),
      Comment.countDocuments({ author: userId }),
      this.getLikesReceived(userId),
      this.getSavesReceived(userId),
      Vote.countDocuments({ userId }),
      CollaborationRequest.countDocuments({
        $or: [
          { requesterId: userId, status: 'accepted' },
          { receiverId: userId, status: 'accepted' }
        ]
      }),
      User.findById(userId)
    ]);

    const accountAgeWeeks = user ? Math.floor((Date.now() - (user as any).createdAt.getTime()) / (1000 * 60 * 60 * 24 * 7)) : 0;
    const profileCompletion = this.calculateProfileCompletion(user);

    return {
      projectsCount,
      ideasCount,
      commentsCount,
      likesReceived,
      savesReceived,
      votesCount,
      collaborationsCount,
      accountAgeWeeks,
      profileCompletion,
      skillsCount: user?.skills?.length || 0,
      isEarlyAdopter: accountAgeWeeks >= 52, // Adjust based on your launch date
      isBetaTester: user?.role === 'beta_tester' || false
    };
  }

  /**
   * Check if user meets badge criteria
   */
  static async checkBadgeCriteria(badge: any, userStats: any, userId: string, action: string, targetId?: string): Promise<boolean> {
    const { criteria } = badge;

    switch (criteria.type) {
      case 'count':
        return this.checkCountCriteria(criteria, userStats);
      
      case 'rank':
        return await this.checkRankCriteria(criteria, userId);
      
      case 'custom':
        return this.checkCustomCriteria(criteria, userStats, userId);
      
      default:
        return false;
    }
  }

  /**
   * Check count-based criteria
   */
  static checkCountCriteria(criteria: any, userStats: any): boolean {
    const { target, threshold } = criteria;
    
    switch (target) {
      case 'projects':
        return userStats.projectsCount >= threshold;
      case 'ideas':
        return userStats.ideasCount >= threshold;
      case 'comments':
        return userStats.commentsCount >= threshold;
      case 'likes_received':
        return userStats.likesReceived >= threshold;
      case 'saves_received':
        return userStats.savesReceived >= threshold;
      case 'votes':
        return userStats.votesCount >= threshold;
      case 'collaborations':
        return userStats.collaborationsCount >= threshold;
      case 'skills':
        return userStats.skillsCount >= threshold;
      default:
        return false;
    }
  }

  /**
   * Check rank-based criteria
   */
  static async checkRankCriteria(criteria: any, userId: string): Promise<boolean> {
    const { threshold } = criteria;
    
    // Get user's current rank
    const users = await User.find({ isActive: true }).select('_id').lean();
    const userScores = await Promise.all(
      users.map(async (user: any) => {
        const ideas = await Idea.countDocuments({ author: user._id });
        const projects = await Project.countDocuments({ author: user._id });
        const collabs = await CollaborationRequest.countDocuments({
          $or: [
            { requesterId: user._id, status: 'accepted' },
            { receiverId: user._id, status: 'accepted' }
          ]
        });
        const score = (ideas * 10) + (projects * 50) + (collabs * 30);
        return { userId: user._id, score };
      })
    );

    userScores.sort((a, b) => b.score - a.score);
    const userRank = userScores.findIndex(u => u.userId.toString() === userId) + 1;

    return userRank <= threshold;
  }

  /**
   * Check custom criteria
   */
  static checkCustomCriteria(criteria: any, userStats: any, userId: string): boolean {
    const { customLogic } = criteria;

    switch (customLogic) {
      case 'account_age_weeks >= 1':
        return userStats.accountAgeWeeks >= 1;
      case 'account_age_weeks >= 4':
        return userStats.accountAgeWeeks >= 4;
      case 'account_age_weeks >= 52':
        return userStats.accountAgeWeeks >= 52;
      case 'profile_completion >= 100':
        return userStats.profileCompletion >= 100;
      case 'early_adopter':
        return userStats.isEarlyAdopter;
      case 'beta_tester':
        return userStats.isBetaTester;
      default:
        return false;
    }
  }

  /**
   * Get total likes received by user
   */
  static async getLikesReceived(userId: string): Promise<number> {
    const userProjects = await Project.find({ author: userId }).select('_id');
    const userIdeas = await Idea.find({ author: userId }).select('_id');
    const userComments = await Comment.find({ author: userId }).select('_id');

    const projectIds = userProjects.map(p => p._id);
    const ideaIds = userIdeas.map(i => i._id);
    const commentIds = userComments.map(c => c._id);

    const [projectLikes, ideaLikes, commentLikes] = await Promise.all([
      Like.countDocuments({ targetType: 'project', targetId: { $in: projectIds } }),
      Like.countDocuments({ targetType: 'idea', targetId: { $in: ideaIds } }),
      Like.countDocuments({ targetType: 'comment', targetId: { $in: commentIds } })
    ]);

    return projectLikes + ideaLikes + commentLikes;
  }

  /**
   * Get total saves received by user
   */
  static async getSavesReceived(userId: string): Promise<number> {
    const userProjects = await Project.find({ author: userId }).select('_id');
    const userIdeas = await Idea.find({ author: userId }).select('_id');
    const userComments = await Comment.find({ author: userId }).select('_id');

    const projectIds = userProjects.map(p => p._id);
    const ideaIds = userIdeas.map(i => i._id);
    const commentIds = userComments.map(c => c._id);

    const [projectSaves, ideaSaves, commentSaves] = await Promise.all([
      Save.countDocuments({ targetType: 'project', targetId: { $in: projectIds } }),
      Save.countDocuments({ targetType: 'idea', targetId: { $in: ideaIds } }),
      Save.countDocuments({ targetType: 'comment', targetId: { $in: commentIds } })
    ]);

    return projectSaves + ideaSaves + commentSaves;
  }

  /**
   * Calculate profile completion percentage
   */
  static calculateProfileCompletion(user: any): number {
    if (!user) return 0;

    let completion = 0;
    const fields = [
      'name', 'bio', 'skills', 'avatarStyle', 'location', 'website', 'github', 'linkedin'
    ];

    fields.forEach(field => {
      if (user[field] && (Array.isArray(user[field]) ? user[field].length > 0 : user[field].trim())) {
        completion += 12.5; // 100 / 8 fields
      }
    });

    return Math.min(100, Math.round(completion));
  }

  /**
   * Create notification for badge earning
   */
  static async createBadgeNotification(userId: string, badge: any) {
    try {
      await Notification.create({
        userId,
        type: 'badge_earned',
        title: 'Badge Earned!',
        message: `🎉 Congratulations! You earned the "${badge.name}" badge!`,
        data: {
          badgeId: badge._id,
          badgeName: badge.name,
          badgeIcon: badge.icon,
          pointsAwarded: badge.points
        },
        isRead: false
      });
    } catch (error) {
      console.error('Error creating badge notification:', error);
    }
  }

  /**
   * Get user's badges with details
   */
  static async getUserBadges(userId: string) {
    try {
      const userBadges = await UserBadge.find({ userId, isDisplayed: true })
        .populate('badgeId')
        .sort({ earnedAt: -1 });

      return userBadges.map(ub => ({
        ...(ub.badgeId as any).toObject(),
        earnedAt: ub.earnedAt,
        pointsAwarded: ub.pointsAwarded
      }));
    } catch (error) {
      console.error('Error getting user badges:', error);
      return [];
    }
  }

  /**
   * Get all available badges (for display purposes)
   */
  static async getAllBadges() {
    try {
      return await Badge.find({ isActive: true }).sort({ category: 1, rarity: 1 });
    } catch (error) {
      console.error('Error getting all badges:', error);
      return [];
    }
  }
}
