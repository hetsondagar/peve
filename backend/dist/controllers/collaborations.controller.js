"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestCollaboration = requestCollaboration;
exports.respondToCollaboration = respondToCollaboration;
exports.getCollaborationRequests = getCollaborationRequests;
exports.getMyCollaborationRequests = getMyCollaborationRequests;
const Collaboration_1 = require("../models/Collaboration");
const Idea_1 = require("../models/Idea");
const CollabRoom_1 = require("../models/CollabRoom");
const Notification_1 = require("../models/Notification");
async function requestCollaboration(req, res) {
    try {
        const { ideaId, message, skills, experience, availability } = req.body;
        const requesterId = req.user?.id;
        if (!ideaId || !requesterId) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }
        // Check if idea exists
        const idea = await Idea_1.Idea.findById(ideaId);
        if (!idea) {
            return res.status(404).json({ success: false, error: 'Idea not found' });
        }
        // Check if user is not the author
        if (idea.author.toString() === requesterId) {
            return res.status(400).json({ success: false, error: 'Cannot request collaboration on your own idea' });
        }
        // Check if request already exists
        const existingRequest = await Collaboration_1.Collaboration.findOne({
            ideaId,
            requester: requesterId
        });
        if (existingRequest) {
            return res.status(409).json({ success: false, error: 'Collaboration request already exists' });
        }
        // Create collaboration request
        const collaboration = await Collaboration_1.Collaboration.create({
            ideaId,
            requester: requesterId,
            owner: idea.author,
            message,
            skills,
            experience,
            availability
        });
        // Create notification for idea owner
        await Notification_1.Notification.create({
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
    }
    catch (error) {
        console.error('Request collaboration error:', error);
        res.status(500).json({ success: false, error: 'Failed to create collaboration request' });
    }
}
async function respondToCollaboration(req, res) {
    try {
        const { collaborationId } = req.params;
        const { status } = req.body;
        const userId = req.user?.id;
        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status' });
        }
        const collaboration = await Collaboration_1.Collaboration.findById(collaborationId)
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
            const room = await CollabRoom_1.CollabRoom.create({
                ideaId: collaboration.ideaId,
                name: `Collab: ${collaboration.ideaId.title}`,
                description: `Collaboration room for ${collaboration.ideaId.title}`,
                members: [collaboration.owner, collaboration.requester],
                admins: [collaboration.owner]
            });
            // Add requester to idea collaborators
            await Idea_1.Idea.findByIdAndUpdate(collaboration.ideaId, {
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
            await Notification_1.Notification.create({
                user: collaboration.requester,
                type: 'collaboration_accepted',
                data: {
                    ideaId: collaboration.ideaId,
                    roomId: room._id,
                    message: 'Your collaboration request has been accepted!'
                }
            });
        }
        else {
            // Create notification for requester
            await Notification_1.Notification.create({
                user: collaboration.requester,
                type: 'collaboration_rejected',
                data: {
                    ideaId: collaboration.ideaId,
                    message: 'Your collaboration request was not accepted'
                }
            });
        }
        res.json({ success: true, data: collaboration });
    }
    catch (error) {
        console.error('Respond to collaboration error:', error);
        res.status(500).json({ success: false, error: 'Failed to respond to collaboration request' });
    }
}
async function getCollaborationRequests(req, res) {
    try {
        const userId = req.user?.id;
        const { status } = req.query;
        const filter = { owner: userId };
        if (status) {
            filter.status = status;
        }
        const requests = await Collaboration_1.Collaboration.find(filter)
            .populate('requester', 'username name avatarUrl skills')
            .populate('ideaId', 'title description')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: requests });
    }
    catch (error) {
        console.error('Get collaboration requests error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch collaboration requests' });
    }
}
async function getMyCollaborationRequests(req, res) {
    try {
        const userId = req.user?.id;
        const { status } = req.query;
        const filter = { requester: userId };
        if (status) {
            filter.status = status;
        }
        const requests = await Collaboration_1.Collaboration.find(filter)
            .populate('owner', 'username name avatarUrl')
            .populate('ideaId', 'title description')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: requests });
    }
    catch (error) {
        console.error('Get my collaboration requests error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch collaboration requests' });
    }
}
