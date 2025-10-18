// MongoDB initialization script for production
db = db.getSiblingDB('peve_prod');

// Create collections with proper indexes
db.createCollection('users');
db.createCollection('projects');
db.createCollection('ideas');
db.createCollection('comments');
db.createCollection('likes');
db.createCollection('saves');
db.createCollection('notifications');
db.createCollection('badges');
db.createCollection('userbadges');
db.createCollection('collaborations');
db.createCollection('collaborationrequests');
db.createCollection('collabrooms');
db.createCollection('chatmessages');
db.createCollection('prompts');
db.createCollection('votes');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "createdAt": -1 });

db.projects.createIndex({ "author": 1 });
db.projects.createIndex({ "createdAt": -1 });
db.projects.createIndex({ "tags": 1 });
db.projects.createIndex({ "title": "text", "description": "text" });

db.ideas.createIndex({ "author": 1 });
db.ideas.createIndex({ "createdAt": -1 });
db.ideas.createIndex({ "tags": 1 });
db.ideas.createIndex({ "title": "text", "description": "text" });

db.comments.createIndex({ "targetType": 1, "targetId": 1 });
db.comments.createIndex({ "author": 1 });
db.comments.createIndex({ "createdAt": -1 });
db.comments.createIndex({ "parentComment": 1 });

db.likes.createIndex({ "userId": 1, "targetType": 1, "targetId": 1 }, { unique: true });
db.likes.createIndex({ "targetType": 1, "targetId": 1 });

db.saves.createIndex({ "userId": 1, "targetType": 1, "targetId": 1 }, { unique: true });
db.saves.createIndex({ "targetType": 1, "targetId": 1 });

db.notifications.createIndex({ "userId": 1 });
db.notifications.createIndex({ "createdAt": -1 });
db.notifications.createIndex({ "read": 1 });

db.badges.createIndex({ "name": 1 }, { unique: true });
db.badges.createIndex({ "category": 1 });

db.userbadges.createIndex({ "userId": 1, "badgeId": 1 }, { unique: true });
db.userbadges.createIndex({ "userId": 1 });
db.userbadges.createIndex({ "earnedAt": -1 });

db.collaborations.createIndex({ "projectId": 1 });
db.collaborations.createIndex({ "userId": 1 });
db.collaborations.createIndex({ "status": 1 });

db.collaborationrequests.createIndex({ "targetType": 1, "targetId": 1 });
db.collaborationrequests.createIndex({ "requester": 1 });
db.collaborationrequests.createIndex({ "targetOwner": 1 });
db.collaborationrequests.createIndex({ "status": 1 });

db.collabrooms.createIndex({ "projectId": 1 });
db.collabrooms.createIndex({ "participants": 1 });

db.chatmessages.createIndex({ "roomId": 1 });
db.chatmessages.createIndex({ "createdAt": -1 });

db.prompts.createIndex({ "date": 1 }, { unique: true });
db.prompts.createIndex({ "createdAt": -1 });

db.votes.createIndex({ "userId": 1, "promptId": 1 }, { unique: true });
db.votes.createIndex({ "promptId": 1 });
db.votes.createIndex({ "vote": 1 });

print('Database initialized successfully with collections and indexes');
