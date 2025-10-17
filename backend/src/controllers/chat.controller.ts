import { Request, Response } from 'express';
import { ChatMessage } from '../models/ChatMessage';
import { CollabRoom } from '../models/CollabRoom';
import { User } from '../models/User';

export async function getChatMessages(req: Request, res: Response) {
  try {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = (req as any).user?.id;

    // Check if user is member of the room
    const room = await CollabRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, error: 'Room not found' });
    }

    if (!room.members.includes(userId)) {
      return res.status(403).json({ success: false, error: 'Not a member of this room' });
    }

    const skip = (Number(page) - 1) * Number(limit);
    const messages = await ChatMessage.find({ roomId })
      .populate('sender', 'username name avatarUrl')
      .populate('replyTo', 'message sender')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    res.json({ success: true, data: messages.reverse() });
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch messages' });
  }
}

export async function sendMessage(req: Request, res: Response) {
  try {
    const { roomId } = req.params;
    const { message, messageType = 'text', replyTo, attachments } = req.body;
    const userId = (req as any).user?.id;

    if (!message && !attachments?.length) {
      return res.status(400).json({ success: false, error: 'Message content required' });
    }

    // Check if user is member of the room
    const room = await CollabRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, error: 'Room not found' });
    }

    if (!room.members.includes(userId)) {
      return res.status(403).json({ success: false, error: 'Not a member of this room' });
    }

    const chatMessage = await ChatMessage.create({
      roomId,
      sender: userId,
      message,
      messageType,
      replyTo,
      attachments
    });

    // Update room's last activity
    await CollabRoom.findByIdAndUpdate(roomId, {
      lastActivity: new Date()
    });

    const populatedMessage = await ChatMessage.findById(chatMessage._id)
      .populate('sender', 'username name avatarUrl')
      .populate('replyTo', 'message sender');

    res.status(201).json({ success: true, data: populatedMessage });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
}

export async function getCollabRooms(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;

    const rooms = await CollabRoom.find({
      members: userId,
      isActive: true
    })
      .populate('ideaId', 'title description')
      .populate('projectId', 'title description')
      .populate('members', 'username name avatarUrl')
      .sort({ lastActivity: -1 });

    res.json({ success: true, data: rooms });
  } catch (error) {
    console.error('Get collab rooms error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch collaboration rooms' });
  }
}

export async function getCollabRoom(req: Request, res: Response) {
  try {
    const { roomId } = req.params;
    const userId = (req as any).user?.id;

    const room = await CollabRoom.findById(roomId)
      .populate('ideaId', 'title description author')
      .populate('projectId', 'title description author')
      .populate('members', 'username name avatarUrl skills')
      .populate('admins', 'username name avatarUrl');

    if (!room) {
      return res.status(404).json({ success: false, error: 'Room not found' });
    }

    if (!room.members.includes(userId)) {
      return res.status(403).json({ success: false, error: 'Not a member of this room' });
    }

    res.json({ success: true, data: room });
  } catch (error) {
    console.error('Get collab room error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch room details' });
  }
}

export async function pinMessage(req: Request, res: Response) {
  try {
    const { roomId, messageId } = req.params;
    const userId = (req as any).user?.id;

    // Check if user is admin of the room
    const room = await CollabRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, error: 'Room not found' });
    }

    if (!room.admins.includes(userId)) {
      return res.status(403).json({ success: false, error: 'Not authorized to pin messages' });
    }

    // Toggle pin status
    const message = await ChatMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    message.isPinned = !message.isPinned;
    await message.save();

    // Update room's pinned messages
    if (message.isPinned) {
      await CollabRoom.findByIdAndUpdate(roomId, {
        $addToSet: { pinnedMessages: messageId }
      });
    } else {
      await CollabRoom.findByIdAndUpdate(roomId, {
        $pull: { pinnedMessages: messageId }
      });
    }

    res.json({ success: true, data: message });
  } catch (error) {
    console.error('Pin message error:', error);
    res.status(500).json({ success: false, error: 'Failed to pin/unpin message' });
  }
}
