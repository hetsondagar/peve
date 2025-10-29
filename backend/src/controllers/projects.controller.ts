import { Request, Response } from 'express';
import { Project } from '../models/Project';
import { User } from '../models/User';
import { Comment } from '../models/Comment';
import { CollaborationRequest } from '../models/CollaborationRequest';
import { Notification } from '../models/Notification';
import { BadgeService } from '../services/badgeService';

export async function listProjects(req: Request, res: Response) {
  try {
    const { 
      page = '1', 
      limit = '20', 
      tech, 
      author, 
      status, 
      featured, 
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search
    } = req.query as any;
    
    const q: any = { visibility: 'public', isDraft: false };
    
    if (tech) q.techStack = { $in: String(tech).split(',') };
    if (author) q.author = author;
    if (status) q.status = status;
    if (featured === 'true') q.featured = true;
    if (search) {
      q.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tagline: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
        { keyFeatures: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const cursor = Project.find(q)
      .populate('author', 'username name avatarUrl avatarStyle bio skills')
      .populate('contributors.user', 'username name avatarUrl avatarStyle bio skills')
      .sort(sort)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
      
    const [items, total] = await Promise.all([cursor, Project.countDocuments(q)]);
    
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
    console.error('List projects error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch projects' });
  }
}

export async function getProject(req: Request, res: Response) {
  try {
    const project = await Project.findById(req.params.id)
      .populate('author', 'username name avatarUrl avatarStyle bio skills')
      .populate('contributors.user', 'username name avatarUrl avatarStyle bio skills');
    
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    
    // Increment view count
    await Project.findByIdAndUpdate(req.params.id, {
      $inc: { 'metrics.views': 1 }
    });
    
    // Get comments for this project
    const comments = await Comment.find({
      targetType: 'project',
      targetId: req.params.id
    })
      .populate('author', 'username name avatarUrl')
      .sort({ createdAt: -1 })
      .limit(20);
    
    return res.json({ 
      success: true, 
      data: { 
        project, 
        comments 
      } 
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch project' });
  }
}

export async function createProject(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    // Validate required fields
    const { title, tagline, description, category, links } = req.body;
    if (!title || !tagline || !description || !category || !links?.githubRepo) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: title, tagline, description, category, and githubRepo are required' 
      });
    }

    // Process contributors and teammates
    const projectData = { ...req.body };
    
    // Handle contributors (from frontend collaborators field)
    if (projectData.collaborators && projectData.collaborators.length > 0) {
      const validContributors = [];
      for (const contributor of projectData.collaborators) {
        if (contributor && contributor.trim()) {
          const user = await User.findOne({ username: contributor.trim().toLowerCase() });
          if (user) {
            validContributors.push({
              user: user._id,
              role: 'Contributor',
              contributions: 'Project contributor'
            });
          } else {
            console.log(`Contributor username not found: ${contributor}`);
          }
        }
      }
      projectData.contributors = validContributors;
    }

    // Handle collaboration teammates
    if (projectData.collaboration?.teammates && projectData.collaboration.teammates.length > 0) {
      // Validate that all teammates exist as users
      const validTeammates = [];
      for (const teammate of projectData.collaboration.teammates) {
        if (teammate && teammate.trim()) {
          const user = await User.findOne({ username: teammate.trim().toLowerCase() });
          if (user) {
            validTeammates.push(user._id);
          } else {
            console.log(`Teammate username not found: ${teammate}`);
          }
        }
      }
      
      // Only add valid teammates as tags with @ prefix
      if (validTeammates.length > 0) {
        const teammateTags = projectData.collaboration.teammates.map((teammate: string) => `@${teammate}`);
        projectData.tags = [...(projectData.tags || []), ...teammateTags];
      }
      
      // Update the teammates array to only include valid user IDs
      projectData.collaboration.teammates = validTeammates;
    }

    const project = await Project.create({ 
      ...projectData, 
      author: userId,
      metrics: {
        views: 0,
        likes: 0,
        comments: 0,
        saves: 0,
        shares: 0
      }
    });

    // Award badge for first project
    const user = await User.findById(userId);
    if (user && user.stats?.projectsUploaded === 0) {
      await User.findByIdAndUpdate(userId, {
        $inc: { 'stats.projectsUploaded': 1 }
      });
      // Note: Badge system will be implemented separately with proper ObjectId references
    } else if (user) {
      await User.findByIdAndUpdate(userId, {
        $inc: { 'stats.projectsUploaded': 1 }
      });
    }

    const populatedProject = await Project.findById(project._id)
      .populate('author', 'username name avatarUrl avatarStyle bio skills')
      .populate('contributors.user', 'username name avatarUrl avatarStyle bio skills');

    // Check for badge awards
    try {
      console.log('Checking badges for project creation...');
      await BadgeService.checkAndAwardBadges(userId, 'project_created', (project._id as any).toString());
      console.log('Badge check completed successfully');
    } catch (badgeError) {
      console.error('Error checking badges for project creation:', badgeError);
      console.error('Badge error details:', (badgeError as Error).message);
      console.error('Badge error stack:', (badgeError as Error).stack);
    }

    return res.status(201).json({ success: true, data: populatedProject });
  } catch (error) {
    console.error('Create project error:', error);
    console.error('Error details:', (error as Error).message);
    console.error('Stack trace:', (error as Error).stack);
    res.status(500).json({ success: false, error: 'Failed to create project' });
  }
}

export async function updateProject(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, error: 'Not found' });
    if (String(project.author) !== String(userId)) return res.status(403).json({ success: false, error: 'Forbidden' });

    // Process contributors and teammates
    const updateData = { ...req.body };
    
    // Handle contributors (from frontend collaborators field)
    if (updateData.collaborators && updateData.collaborators.length > 0) {
      const validContributors = [];
      for (const contributor of updateData.collaborators) {
        if (contributor && contributor.trim()) {
          const user = await User.findOne({ username: contributor.trim().toLowerCase() });
          if (user) {
            validContributors.push({
              user: user._id,
              role: 'Contributor',
              contributions: 'Project contributor'
            });
          } else {
            console.log(`Contributor username not found: ${contributor}`);
          }
        }
      }
      updateData.contributors = validContributors;
    }

    // Handle collaboration teammates
    if (updateData.collaboration?.teammates && updateData.collaboration.teammates.length > 0) {
      // Validate that all teammates exist as users
      const validTeammates = [];
      for (const teammate of updateData.collaboration.teammates) {
        if (teammate && teammate.trim()) {
          const user = await User.findOne({ username: teammate.trim().toLowerCase() });
          if (user) {
            validTeammates.push(user._id);
          } else {
            console.log(`Teammate username not found: ${teammate}`);
          }
        }
      }
      
      // Only add valid teammates as tags with @ prefix
      if (validTeammates.length > 0) {
        const teammateTags = updateData.collaboration.teammates.map((teammate: string) => `@${teammate}`);
        updateData.tags = [...(updateData.tags || []), ...teammateTags];
      }
      
      // Update the teammates array to only include valid user IDs
      updateData.collaboration.teammates = validTeammates;
    }

    Object.assign(project, updateData);
    await project.save();
    
    // Populate the project with author and contributors data
    const updatedProject = await Project.findById(project._id)
      .populate('author', 'username name avatarUrl avatarStyle bio skills')
      .populate('contributors.user', 'username name avatarUrl avatarStyle bio skills');
    
    return res.json({ success: true, data: updatedProject });
  } catch (error) {
    console.error('Update project error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update project' });
  }
}

export async function deleteProject(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    
    // Check if user is the author
    if (String(project.author) !== String(userId)) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }
    
    // Delete associated comments
    await Comment.deleteMany({ targetType: 'project', targetId: project._id });
    
    // Delete associated collaboration requests
    await CollaborationRequest.deleteMany({ project: project._id });
    
    // Delete the project
    await Project.findByIdAndDelete(req.params.id);
    
    return res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete project' });
  }
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
  try {
    const userId = (req as any).user?.id;
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    
    const fork = await Project.create({
      title: project.title + ' (fork)',
      tagline: project.tagline,
      description: project.description,
      author: userId,
      contributors: [],
      techStack: project.techStack,
      category: project.category,
      difficultyLevel: project.difficultyLevel,
      developmentStage: 'idea',
      coverImage: project.coverImage,
      screenshots: project.screenshots,
      keyFeatures: project.keyFeatures,
      links: project.links,
      collaboration: {
        openToCollaboration: true,
        lookingForRoles: [],
        teammates: []
      },
      badges: [],
      visibility: 'public',
      isDraft: false,
      tags: project.tags,
      status: 'planning',
      metrics: {
        views: 0,
        likes: 0,
        forks: 0,
        comments: 0,
        stars: 0,
        saves: 0,
        shares: 0
      }
    });
    
    // Increment fork count on original project
    await Project.findByIdAndUpdate(req.params.id, {
      $inc: { 'metrics.forks': 1 }
    });
    
    return res.json({ success: true, data: fork });
  } catch (error) {
    console.error('Fork project error:', error);
    res.status(500).json({ success: false, error: 'Failed to fork project' });
  }
}

export async function getTrendingProjects(req: Request, res: Response) {
  try {
    const { limit = '10' } = req.query;
    
    // Get projects with highest engagement (likes + views + comments)
    const projects = await Project.find({ visibility: 'public', isDraft: false })
      .populate('author', 'username name avatarUrl avatarStyle bio skills')
      .sort({ 
        'metrics.likes': -1, 
        'metrics.views': -1, 
        'metrics.comments': -1,
        createdAt: -1 
      })
      .limit(Number(limit));
    
    res.json({ success: true, data: projects });
  } catch (error) {
    console.error('Get trending projects error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch trending projects' });
  }
}

export async function likeProject(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const { projectId } = req.params;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    
    // Check if user already liked this project
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    // For now, just increment like count (in a real app, you'd track individual likes)
    await Project.findByIdAndUpdate(projectId, {
      $inc: { 'metrics.likes': 1 }
    });
    
    // Update user's stats
    await User.findByIdAndUpdate(userId, {
      $inc: { 'stats.likesReceived': 1 }
    });
    
    res.json({ success: true, message: 'Project liked successfully' });
  } catch (error) {
    console.error('Like project error:', error);
    res.status(500).json({ success: false, error: 'Failed to like project' });
  }
}

export async function bookmarkProject(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const { projectId } = req.params;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    // Toggle bookmark
    const isBookmarked = user.bookmarkedProjects.includes(projectId as any);
    
    if (isBookmarked) {
      await User.findByIdAndUpdate(userId, {
        $pull: { bookmarkedProjects: projectId }
      });
      await Project.findByIdAndUpdate(projectId, {
        $inc: { 'metrics.saves': -1 }
      });
    } else {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { bookmarkedProjects: projectId }
      });
      await Project.findByIdAndUpdate(projectId, {
        $inc: { 'metrics.saves': 1 }
      });
    }
    
    res.json({ 
      success: true, 
      data: { 
        bookmarked: !isBookmarked,
        message: !isBookmarked ? 'Project bookmarked' : 'Bookmark removed'
      } 
    });
  } catch (error) {
    console.error('Bookmark project error:', error);
    res.status(500).json({ success: false, error: 'Failed to bookmark project' });
  }
}

export async function shareProject(req: Request, res: Response) {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    
    // Increment share count
    await Project.findByIdAndUpdate(projectId, {
      $inc: { 'metrics.shares': 1 }
    });
    
    res.json({ 
      success: true, 
      data: { 
        message: 'Project shared successfully',
        shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/projects/${projectId}`
      } 
    });
  } catch (error) {
    console.error('Share project error:', error);
    res.status(500).json({ success: false, error: 'Failed to share project' });
  }
}

export async function requestCollaboration(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const { projectId } = req.params;
    const { message, role } = req.body;
    
    const project = await Project.findById(projectId).populate('author', 'username name');
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    
    if (!project.collaboration?.openToCollaboration) {
      return res.status(400).json({ 
        success: false, 
        error: 'This project is not open to collaboration' 
      });
    }
    
    // Check if user is trying to collaborate on their own project
    if (project.author._id.toString() === userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Cannot send collaboration request to yourself' 
      });
    }
    
    // Check if request already exists
    const existingRequest = await CollaborationRequest.findOne({
      projectId,
      requesterId: userId
    });
    
    if (existingRequest) {
      return res.status(400).json({ 
        success: false, 
        error: 'Request already sent for this project' 
      });
    }
    
    // Create collaboration request
    const collaborationRequest = await CollaborationRequest.create({
      projectId,
      requesterId: userId,
      receiverId: project.author._id,
      compatibilityScore: 0, // Default score for project collaboration
      message: message || '',
      role: role || ''
    });
    
    // Create notification for project owner
    const requester = await User.findById(userId).select('username name');
    await Notification.create({
      user: project.author._id,
      type: 'collaboration_request',
      data: {
        requesterId: userId,
        requesterName: requester?.username,
        projectId: projectId,
        projectTitle: project.title,
        collaborationRequestId: collaborationRequest._id,
        message: message || '',
        role: role || ''
      }
    });
    
    // Add to users' tracking arrays
    await Promise.all([
      User.findByIdAndUpdate(userId, {
        $push: { collabRequestsSent: collaborationRequest._id }
      }),
      User.findByIdAndUpdate(project.author._id, {
        $push: { collabRequestsReceived: collaborationRequest._id }
      })
    ]);
    
    res.json({ 
      success: true, 
      data: { 
        message: 'Collaboration request sent successfully',
        projectTitle: project.title,
        authorUsername: (project.author as any).username,
        collaborationRequestId: collaborationRequest._id
      } 
    });
  } catch (error) {
    console.error('Request collaboration error:', error);
    res.status(500).json({ success: false, error: 'Failed to send collaboration request' });
  }
}


