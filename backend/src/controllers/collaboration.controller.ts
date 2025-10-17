import { Request, Response } from 'express';
import { User } from '../models/User';
import { Idea } from '../models/Idea';
import { CollaborationRequest } from '../models/CollaborationRequest';
import { Notification } from '../models/Notification';
import { computeCompatibility } from '../services/compatibility';

// Check compatibility between two users
export async function checkCompatibility(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const { targetUserId } = req.body;

    if (!userId || !targetUserId) {
      return res.status(400).json({ success: false, error: 'User IDs are required' });
    }

    if (userId === targetUserId) {
      return res.status(400).json({ success: false, error: 'Cannot check compatibility with yourself' });
    }

    // Get both users' compatibility profiles
    const [userA, userB] = await Promise.all([
      User.findById(userId).select('compatibilityProfile username name'),
      User.findById(targetUserId).select('compatibilityProfile username name')
    ]);

    if (!userA || !userB) {
      return res.status(404).json({ success: false, error: 'One or both users not found' });
    }

    if (!userA.compatibilityProfile || !userB.compatibilityProfile) {
      return res.status(400).json({ success: false, error: 'One or both users have incomplete compatibility profiles' });
    }

    // Calculate compatibility score
    const compatibility = computeCompatibility(
      userA.compatibilityProfile,
      userB.compatibilityProfile
    );

    return res.json({
      success: true,
      data: {
        compatibility,
        users: {
          requester: {
            id: userA._id,
            username: userA.username,
            name: userA.name
          },
          receiver: {
            id: userB._id,
            username: userB.username,
            name: userB.name
          }
        }
      }
    });
  } catch (error) {
    console.error('Check compatibility error:', error);
    res.status(500).json({ success: false, error: 'Failed to check compatibility' });
  }
}

// Create collaboration request
export async function createCollaborationRequest(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const { ideaId, receiverId, compatibilityScore, message } = req.body;

    if (!userId || !ideaId || !receiverId || compatibilityScore === undefined) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    if (userId === receiverId) {
      return res.status(400).json({ success: false, error: 'Cannot send request to yourself' });
    }

    // Check if idea exists and is in "want_to_build" mode
    const idea = await Idea.findById(ideaId).populate('author', 'username name');
    if (!idea) {
      return res.status(404).json({ success: false, error: 'Idea not found' });
    }

    if (idea.mode !== 'want_to_build') {
      return res.status(400).json({ success: false, error: 'This idea is not open for collaboration' });
    }

    if (idea.author._id.toString() !== receiverId) {
      return res.status(400).json({ success: false, error: 'Invalid receiver for this idea' });
    }

    // Check if request already exists
    const existingRequest = await CollaborationRequest.findOne({
      ideaId,
      requesterId: userId
    });

    if (existingRequest) {
      return res.status(400).json({ success: false, error: 'Request already sent for this idea' });
    }

    // Create collaboration request
    const collaborationRequest = await CollaborationRequest.create({
      ideaId,
      requesterId: userId,
      receiverId,
      compatibilityScore,
      message: message || ''
    });

    // Add to idea's collabRequests array
    await Idea.findByIdAndUpdate(ideaId, {
      $push: {
        collabRequests: {
          requesterId: userId,
          status: 'pending',
          score: compatibilityScore,
          message: message || ''
        }
      }
    });

    // Add to users' tracking arrays
    await Promise.all([
      User.findByIdAndUpdate(userId, {
        $push: { collabRequestsSent: collaborationRequest._id }
      }),
      User.findByIdAndUpdate(receiverId, {
        $push: { collabRequestsReceived: collaborationRequest._id }
      })
    ]);

    // Create notification for receiver using the Notification model
    const requester = await User.findById(userId).select('username name');
    await Notification.create({
      user: receiverId,
      type: 'collaboration_request',
      data: {
        requesterId: userId,
        requesterName: requester?.username,
        ideaId: ideaId,
        ideaTitle: idea.title,
        collaborationRequestId: collaborationRequest._id,
        message: message || ''
      }
    });

    // Populate the response
    const populatedRequest = await CollaborationRequest.findById(collaborationRequest._id)
      .populate('requesterId', 'username name avatarUrl')
      .populate('receiverId', 'username name avatarUrl')
      .populate('ideaId', 'title');

    return res.status(201).json({
      success: true,
      data: populatedRequest
    });
  } catch (error) {
    console.error('Create collaboration request error:', error);
    res.status(500).json({ success: false, error: 'Failed to create collaboration request' });
  }
}

// Accept collaboration request
export async function acceptCollaborationRequest(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const { requestId } = req.params;

    const request = await CollaborationRequest.findById(requestId)
      .populate('requesterId', 'username name')
      .populate('ideaId', 'title') as any;

    if (!request) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    if (request.receiverId.toString() !== userId) {
      return res.status(403).json({ success: false, error: 'Not authorized to accept this request' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, error: 'Request has already been processed' });
    }

    // Update request status
    request.status = 'accepted';
    await request.save();

    // Update idea's collabRequests and teamMembers
    await Idea.findByIdAndUpdate(request.ideaId, {
      $set: {
        'collabRequests.$[elem].status': 'accepted'
      },
      $addToSet: {
        teamMembers: request.requesterId
      }
    }, {
      arrayFilters: [{ 'elem.requesterId': request.requesterId }]
    });

    // Create notification for requester
    await User.findByIdAndUpdate(request.requesterId, {
      $push: {
        notifications: {
          type: 'collaboration_accepted',
          message: `🎉 Your collaboration request for "${request.ideaId.title}" was accepted!`,
          relatedId: request._id,
          seen: false
        }
      }
    });

    return res.json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Accept collaboration request error:', error);
    res.status(500).json({ success: false, error: 'Failed to accept collaboration request' });
  }
}

// Reject collaboration request
export async function rejectCollaborationRequest(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const { requestId } = req.params;

    const request = await CollaborationRequest.findById(requestId)
      .populate('requesterId', 'username name')
      .populate('ideaId', 'title') as any;

    if (!request) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    if (request.receiverId.toString() !== userId) {
      return res.status(403).json({ success: false, error: 'Not authorized to reject this request' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, error: 'Request has already been processed' });
    }

    // Update request status
    request.status = 'rejected';
    await request.save();

    // Update idea's collabRequests
    await Idea.findByIdAndUpdate(request.ideaId, {
      $set: {
        'collabRequests.$[elem].status': 'rejected'
      }
    }, {
      arrayFilters: [{ 'elem.requesterId': request.requesterId }]
    });

    // Create notification for requester
    await User.findByIdAndUpdate(request.requesterId, {
      $push: {
        notifications: {
          type: 'collaboration_rejected',
          message: `❌ Your request for "${request.ideaId.title}" was declined.`,
          relatedId: request._id,
          seen: false
        }
      }
    });

    return res.json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Reject collaboration request error:', error);
    res.status(500).json({ success: false, error: 'Failed to reject collaboration request' });
  }
}

// Get user's collaboration requests
export async function getMyRequests(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;

    const [sentRequests, receivedRequests] = await Promise.all([
      CollaborationRequest.find({ requesterId: userId })
        .populate('ideaId', 'title mode')
        .populate('receiverId', 'username name avatarUrl')
        .sort({ createdAt: -1 }),
      CollaborationRequest.find({ receiverId: userId })
        .populate('ideaId', 'title mode')
        .populate('requesterId', 'username name avatarUrl')
        .sort({ createdAt: -1 })
    ]);

    return res.json({
      success: true,
      data: {
        sent: sentRequests,
        received: receivedRequests
      }
    });
  } catch (error) {
    console.error('Get my requests error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch requests' });
  }
}

// Get user's notifications
export async function getNotifications(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;

    const user = await User.findById(userId).select('notifications');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Sort notifications by creation date (newest first)
    const sortedNotifications = user.notifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return res.json({
      success: true,
      data: sortedNotifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch notifications' });
  }
}

// Mark notification as seen
export async function markNotificationSeen(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const { notificationId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Find and update the notification
    const notification = user.notifications.find((n: any) => n._id?.toString() === notificationId);
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }

    notification.seen = true;
    await user.save();

    return res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Mark notification seen error:', error);
    res.status(500).json({ success: false, error: 'Failed to mark notification as seen' });
  }
}

// Mark all notifications as seen
export async function markAllNotificationsSeen(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;

    await User.findByIdAndUpdate(userId, {
      $set: {
        'notifications.$[].seen': true
      }
    });

    return res.json({
      success: true,
      message: 'All notifications marked as seen'
    });
  } catch (error) {
    console.error('Mark all notifications seen error:', error);
    res.status(500).json({ success: false, error: 'Failed to mark all notifications as seen' });
  }
}
