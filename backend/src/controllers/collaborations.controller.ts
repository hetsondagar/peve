import { Request, Response } from 'express';
import { Collaboration } from '../models/Collaboration';
import { Idea } from '../models/Idea';
import { User } from '../models/User';
import { CollabRoom } from '../models/CollabRoom';
import { Notification } from '../models/Notification';

export async function requestCollaboration(req: Request, res: Response) {
  try {
    const { ideaId, message, skills, experience, availability } = req.body;
    const requesterId = (req as any).user?.id;

    if (!ideaId || !requesterId) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Check if idea exists
    const idea = await Idea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({ success: false, error: 'Idea not found' });
    }

    // Check if user is not the author
    if (idea.author.toString() === requesterId) {
      return res.status(400).json({ success: false, error: 'Cannot request collaboration on your own idea' });
    }

    // Check if request already exists
    const existingRequest = await Collaboration.findOne({
      ideaId,
      requester: requesterId
    });

    if (existingRequest) {
      return res.status(409).json({ success: false, error: 'Collaboration request already exists' });
    }

    // Create collaboration request
    const collaboration = await Collaboration.create({
      ideaId,
      requester: requesterId,
      owner: idea.author,
      message,
      skills,
      experience,
      availability
    });

    // Create notification for idea owner
    await Notification.create({
      user: idea.author,
      type: 'collaboration_request',
      data: {
        requesterId,
        ideaId,
        collaborationId: collaboration._id,
        message
      }
    });

    res.status(201).json({ success: true, data: collaboration });
  } catch (error) {
    console.error('Request collaboration error:', error);
    res.status(500).json({ success: false, error: 'Failed to create collaboration request' });
  }
}

export async function respondToCollaboration(req: Request, res: Response) {
  try {
    const { collaborationId } = req.params;
    const { status } = req.body;
    const userId = (req as any).user?.id;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const collaboration = await Collaboration.findById(collaborationId)
      .populate('requester', 'username name email')
      .populate('ideaId', 'title');

    if (!collaboration) {
      return res.status(404).json({ success: false, error: 'Collaboration request not found' });
    }

    if (collaboration.owner.toString() !== userId) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    collaboration.status = status;
    await collaboration.save();

    // If accepted, create collaboration room
    if (status === 'accepted') {
      const room = await CollabRoom.create({
        ideaId: collaboration.ideaId,
        name: `Collab: ${(collaboration.ideaId as any).title}`,
        description: `Collaboration room for ${(collaboration.ideaId as any).title}`,
        members: [collaboration.owner, collaboration.requester],
        admins: [collaboration.owner]
      });

      // Add requester to idea collaborators
      await Idea.findByIdAndUpdate(collaboration.ideaId, {
        $push: {
          collaborators: {
            user: collaboration.requester,
            role: 'collaborator',
            joinedAt: new Date(),
            accepted: true
          }
        }
      });

      // Create notification for requester
      await Notification.create({
        user: collaboration.requester,
        type: 'collaboration_accepted',
        data: {
          ideaId: collaboration.ideaId,
          roomId: room._id,
          message: 'Your collaboration request has been accepted!'
        }
      });
    } else {
      // Create notification for requester
      await Notification.create({
        user: collaboration.requester,
        type: 'collaboration_rejected',
        data: {
          ideaId: collaboration.ideaId,
          message: 'Your collaboration request was not accepted'
        }
      });
    }

    res.json({ success: true, data: collaboration });
  } catch (error) {
    console.error('Respond to collaboration error:', error);
    res.status(500).json({ success: false, error: 'Failed to respond to collaboration request' });
  }
}

export async function getCollaborationRequests(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const { status } = req.query;

    const filter: any = { owner: userId };
    if (status) {
      filter.status = status;
    }

    const requests = await Collaboration.find(filter)
      .populate('requester', 'username name avatarUrl skills')
      .populate('ideaId', 'title description')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (error) {
    console.error('Get collaboration requests error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch collaboration requests' });
  }
}

export async function getMyCollaborationRequests(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const { status } = req.query;

    const filter: any = { requester: userId };
    if (status) {
      filter.status = status;
    }

    const requests = await Collaboration.find(filter)
      .populate('owner', 'username name avatarUrl')
      .populate('ideaId', 'title description')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (error) {
    console.error('Get my collaboration requests error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch collaboration requests' });
  }
}
