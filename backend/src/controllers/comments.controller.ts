import { Request, Response } from 'express';
import { Comment } from '../models/Comment';
import { Idea } from '../models/Idea';
import { Project } from '../models/Project';
import { User } from '../models/User';
import { BadgeService } from '../services/badgeService';

export async function createComment(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const { content, targetType, targetId, parentComment } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    if (!content || !targetType || !targetId) {
      return res.status(400).json({ success: false, error: 'Content, targetType, and targetId are required' });
    }

    const normalizedTargetType = targetType.toLowerCase();
    if (!['idea', 'project', 'prompt'].includes(normalizedTargetType)) {
      return res.status(400).json({ success: false, error: 'targetType must be "idea", "project", or "prompt"' });
    }

    // Verify target exists
    if (normalizedTargetType === 'idea') {
      const idea = await Idea.findById(targetId);
      if (!idea) {
        return res.status(404).json({ success: false, error: 'Idea not found' });
      }
    } else if (normalizedTargetType === 'project') {
      const project = await Project.findById(targetId);
      if (!project) {
        return res.status(404).json({ success: false, error: 'Project not found' });
      }
    } else if (normalizedTargetType === 'prompt') {
      // For prompts, we don't need to verify existence as they're managed by the prompt system
      // The prompt controller will handle this
    }

    // Create comment
    const comment = await Comment.create({
      content: content.trim(),
      author: userId,
      targetType: normalizedTargetType,
      targetId,
      parentComment: parentComment || undefined,
    });

    // Populate author info
    await comment.populate('author', 'username name avatarUrl');

    // Update comment count on target
    if (normalizedTargetType === 'idea') {
      await Idea.findByIdAndUpdate(targetId, {
        $inc: { commentCount: 1 }
      });

      // Create notification for idea author (if not the same user)
      const idea = await Idea.findById(targetId);
      if (idea && idea.author.toString() !== userId) {
        const user = await User.findById(userId);
        await User.findByIdAndUpdate(idea.author, {
          $push: {
            notifications: {
              type: 'idea_commented',
              message: `💬 ${user?.username || user?.name} commented on your idea: "${idea.title}"`,
              relatedId: targetId,
              seen: false,
              createdAt: new Date(),
            }
          }
        });
      }
    } else {
      await Project.findByIdAndUpdate(targetId, {
        $inc: { 'metrics.comments': 1 }
      });

      // Create notification for project author (if not the same user)
      const project = await Project.findById(targetId);
      if (project && project.author.toString() !== userId) {
        const user = await User.findById(userId);
        await User.findByIdAndUpdate(project.author, {
          $push: {
            notifications: {
              type: 'project_commented',
              message: `💬 ${user?.username || user?.name} commented on your project: "${project.title}"`,
              relatedId: targetId,
              seen: false,
              createdAt: new Date(),
            }
          }
        });
      }
    }

    // Check for badge awards
    try {
      await BadgeService.checkAndAwardBadges(userId, 'comment_created', (comment._id as any).toString());
    } catch (badgeError) {
      console.error('Error checking badges for comment creation:', badgeError);
    }

    return res.status(201).json({
      success: true,
      data: comment
    });

  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ success: false, error: 'Failed to create comment' });
  }
}

export async function getComments(req: Request, res: Response) {
  try {
    const { targetType, targetId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const normalizedTargetType = targetType.toLowerCase();
    if (!['idea', 'project', 'prompt'].includes(normalizedTargetType)) {
      return res.status(400).json({ success: false, error: 'targetType must be "idea", "project", or "prompt"' });
    }

    const skip = (Number(page) - 1) * Number(limit);

    const comments = await Comment.find({
      targetType: normalizedTargetType,
      targetId,
      parentComment: { $exists: false } // Only top-level comments
    })
      .populate('author', 'username name avatarUrl avatarStyle')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Add replies count to each comment
    const commentsWithRepliesCount = await Promise.all(
      comments.map(async (comment) => {
        const repliesCount = await Comment.countDocuments({
          parentComment: comment._id
        });
        return {
          ...comment.toObject(),
          repliesCount
        };
      })
    );

    const totalComments = await Comment.countDocuments({
      targetType,
      targetId,
      parentComment: { $exists: false }
    });

    return res.json({
      success: true,
      data: {
        comments: commentsWithRepliesCount,
        pagination: {
          current: Number(page),
          total: Math.ceil(totalComments / Number(limit)),
          hasNext: skip + comments.length < totalComments,
          hasPrev: Number(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Error getting comments:', error);
    res.status(500).json({ success: false, error: 'Failed to get comments' });
  }
}

export async function getCommentReplies(req: Request, res: Response) {
  try {
    const { commentId } = req.params;
    const { page = 1, limit = 5 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const replies = await Comment.find({
      parentComment: commentId
    })
      .populate('author', 'username name avatarUrl avatarStyle')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(Number(limit));

    // Add replies count to each reply
    const repliesWithRepliesCount = await Promise.all(
      replies.map(async (reply) => {
        const repliesCount = await Comment.countDocuments({
          parentComment: reply._id
        });
        return {
          ...reply.toObject(),
          repliesCount
        };
      })
    );

    const totalReplies = await Comment.countDocuments({
      parentComment: commentId
    });

    return res.json({
      success: true,
      data: {
        replies: repliesWithRepliesCount,
        pagination: {
          current: Number(page),
          total: Math.ceil(totalReplies / Number(limit)),
          hasNext: skip + replies.length < totalReplies,
          hasPrev: Number(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Error getting comment replies:', error);
    res.status(500).json({ success: false, error: 'Failed to get comment replies' });
  }
}

export async function updateComment(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const { commentId } = req.params;
    const { content } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Content is required' });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }

    if (comment.author.toString() !== userId) {
      return res.status(403).json({ success: false, error: 'Not authorized to edit this comment' });
    }

    comment.content = content.trim();
    comment.isEdited = true;
    comment.editedAt = new Date();

    await comment.save();
    await comment.populate('author', 'username name avatarUrl');

    return res.json({
      success: true,
      data: comment
    });

  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ success: false, error: 'Failed to update comment' });
  }
}

export async function deleteComment(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const { commentId } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }

    if (comment.author.toString() !== userId) {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this comment' });
    }

    // Delete all replies first
    await Comment.deleteMany({ parentComment: commentId });

    // Delete the comment
    await Comment.findByIdAndDelete(commentId);

    // Update comment count on target
    if (comment.targetType === 'idea') {
      await Idea.findByIdAndUpdate(comment.targetId, {
        $inc: { commentCount: -1 }
      });
    } else {
      await Project.findByIdAndUpdate(comment.targetId, {
        $inc: { 'metrics.comments': -1 }
      });
    }

    return res.json({
      success: true,
      message: 'Comment deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ success: false, error: 'Failed to delete comment' });
  }
}

export async function toggleLikeComment(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const { commentId } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }

    const isLiked = comment.likedBy.includes(userId as any);
    let action = '';

    if (isLiked) {
      // Unlike
      comment.likedBy = comment.likedBy.filter(id => id.toString() !== userId);
      comment.likes = Math.max(0, comment.likes - 1);
      action = 'unliked';
    } else {
      // Like
      comment.likedBy.push(userId as any);
      comment.likes += 1;
      action = 'liked';
    }

    await comment.save();

    return res.json({
      success: true,
      data: {
        action,
        likes: comment.likes,
        isLiked: !isLiked
      }
    });

  } catch (error) {
    console.error('Error toggling comment like:', error);
    res.status(500).json({ success: false, error: 'Failed to toggle comment like' });
  }
}