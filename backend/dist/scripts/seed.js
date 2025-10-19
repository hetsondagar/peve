"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("../src/models/User");
const Idea_1 = require("../src/models/Idea");
const Project_1 = require("../src/models/Project");
const Badge_1 = require("../src/models/Badge");
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/peve';
console.log('Seed script connecting to:', MONGO_URI);
async function seedDatabase() {
    try {
        await mongoose_1.default.connect(MONGO_URI);
        console.log('Connected to MongoDB');
        // Clear existing data
        await User_1.User.deleteMany({});
        await Idea_1.Idea.deleteMany({});
        await Project_1.Project.deleteMany({});
        await Badge_1.Badge.deleteMany({});
        console.log('Cleared existing data');
        // Create sample badges
        const badges = await Badge_1.Badge.create([
            {
                key: 'first_project',
                name: 'First Project',
                description: 'Uploaded your first project',
                icon: '🏆',
                category: 'milestone',
                rarity: 'common',
                criteria: {
                    type: 'count',
                    target: 'projects',
                    threshold: 1
                },
                points: 10
            },
            {
                key: 'idea_master',
                name: 'Idea Master',
                description: 'Posted 5 creative ideas',
                icon: '💡',
                category: 'achievement',
                rarity: 'rare',
                criteria: {
                    type: 'count',
                    target: 'ideas',
                    threshold: 5
                },
                points: 25
            },
            {
                key: 'collaborator',
                name: 'Team Player',
                description: 'Joined 3 collaborations',
                icon: '🤝',
                category: 'social',
                rarity: 'rare',
                criteria: {
                    type: 'count',
                    target: 'collaborations',
                    threshold: 3
                },
                points: 30
            },
            {
                key: 'popular',
                name: 'Popular',
                description: 'Received 50+ likes',
                icon: '⭐',
                category: 'social',
                rarity: 'epic',
                criteria: {
                    type: 'count',
                    target: 'likes',
                    threshold: 50
                },
                points: 50
            }
        ]);
        console.log('Created badges');
        // Create sample users
        console.log('Creating users...');
        const users = await User_1.User.create([
            {
                username: 'alexdev',
                name: 'Alex Developer',
                email: 'alex@example.com',
                passwordHash: 'password123',
                bio: 'Full-stack developer passionate about React and Node.js',
                skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
                interests: ['Web Development', 'AI/ML', 'Open Source'],
                college: 'Tech University',
                role: 'developer',
                stats: {
                    projectsUploaded: 3,
                    ideasPosted: 5,
                    collaborationsJoined: 2,
                    likesReceived: 25,
                    totalViews: 150
                },
                badges: [badges[0]._id, badges[1]._id]
            },
            {
                username: 'sarahcoder',
                name: 'Sarah Coder',
                email: 'sarah@example.com',
                passwordHash: 'password123',
                bio: 'Frontend specialist with a love for beautiful UIs',
                skills: ['React', 'Vue.js', 'CSS', 'Design Systems'],
                interests: ['UI/UX', 'Design', 'Animation'],
                college: 'Design Institute',
                role: 'developer',
                stats: {
                    projectsUploaded: 2,
                    ideasPosted: 3,
                    collaborationsJoined: 4,
                    likesReceived: 18,
                    totalViews: 120
                },
                badges: [badges[0]._id, badges[2]._id]
            },
            {
                username: 'mikebuilder',
                name: 'Mike Builder',
                email: 'mike@example.com',
                passwordHash: 'password123',
                bio: 'Backend engineer focused on scalable systems',
                skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
                interests: ['Backend', 'DevOps', 'Microservices'],
                college: 'Engineering College',
                role: 'developer',
                stats: {
                    projectsUploaded: 4,
                    ideasPosted: 2,
                    collaborationsJoined: 1,
                    likesReceived: 32,
                    totalViews: 200
                },
                badges: [badges[0]._id, badges[3]._id]
            }
        ]);
        console.log('Created users:', users.length);
        console.log('First user:', users[0] ? { username: users[0].username, email: users[0].email } : 'None');
        // Create sample ideas
        const ideas = await Idea_1.Idea.create([
            {
                title: 'AI-Powered Code Review Assistant',
                description: 'Build an AI tool that automatically reviews code and suggests improvements, focusing on security vulnerabilities and performance optimizations.',
                author: users[0]._id,
                tags: ['AI', 'Code Review', 'Security', 'Performance'],
                skillsNeeded: ['Python', 'Machine Learning', 'NLP', 'Git'],
                difficulty: 'advanced',
                estimatedTime: '3-6 months',
                status: 'brainstorm',
                isPublic: true,
                likes: 15,
                views: 45,
                comments: 3
            },
            {
                title: 'Real-time Collaborative Whiteboard',
                description: 'A web-based whiteboard where multiple users can draw, write, and collaborate in real-time with features like sticky notes and shapes.',
                author: users[1]._id,
                tags: ['Real-time', 'Collaboration', 'Canvas', 'WebRTC'],
                skillsNeeded: ['React', 'Socket.io', 'Canvas API', 'WebRTC'],
                difficulty: 'intermediate',
                estimatedTime: '2-3 months',
                status: 'planning',
                isPublic: true,
                likes: 22,
                views: 67,
                comments: 8
            },
            {
                title: 'Smart Home Energy Monitor',
                description: 'IoT device and app to monitor and optimize home energy usage with machine learning predictions and cost savings recommendations.',
                author: users[2]._id,
                tags: ['IoT', 'Energy', 'Machine Learning', 'Mobile App'],
                skillsNeeded: ['Arduino', 'Python', 'React Native', 'ML'],
                difficulty: 'advanced',
                estimatedTime: '4-6 months',
                status: 'brainstorm',
                likes: 18,
                views: 52,
                comments: 5
            },
            {
                title: 'Study Group Matching Platform',
                description: 'Connect students with similar study goals and schedules for virtual study sessions with built-in productivity tools.',
                author: users[0]._id,
                tags: ['Education', 'Matching', 'Productivity', 'Social'],
                skillsNeeded: ['React', 'Node.js', 'Matching Algorithm', 'Video Chat'],
                difficulty: 'intermediate',
                estimatedTime: '2-4 months',
                status: 'in-progress',
                isPublic: true,
                likes: 12,
                views: 38,
                comments: 2
            }
        ]);
        console.log('Created ideas');
        // Create sample projects
        const projects = await Project_1.Project.create([
            {
                title: 'TaskFlow - Project Management Tool',
                description: 'A modern project management application with kanban boards, time tracking, and team collaboration features.',
                author: users[0]._id,
                techStack: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
                tags: ['Productivity', 'Management', 'Collaboration'],
                status: 'completed',
                isPublic: true,
                repoUrl: 'https://github.com/alexdev/taskflow',
                liveUrl: 'https://taskflow-demo.vercel.app',
                metrics: {
                    views: 150,
                    likes: 25,
                    forks: 8,
                    comments: 12,
                    stars: 15
                },
                healthScore: 85
            },
            {
                title: 'WeatherWise - Weather Dashboard',
                description: 'Beautiful weather dashboard with 7-day forecasts, interactive maps, and weather alerts.',
                author: users[1]._id,
                techStack: ['Vue.js', 'Chart.js', 'Weather API', 'CSS3'],
                tags: ['Weather', 'Dashboard', 'Visualization'],
                status: 'completed',
                isPublic: true,
                repoUrl: 'https://github.com/sarahcoder/weatherwise',
                liveUrl: 'https://weatherwise.netlify.app',
                metrics: {
                    views: 89,
                    likes: 18,
                    forks: 5,
                    comments: 7,
                    stars: 12
                },
                healthScore: 72
            },
            {
                title: 'EcoTracker - Carbon Footprint Calculator',
                description: 'Track your carbon footprint with daily activities, transportation, and consumption patterns.',
                author: users[2]._id,
                techStack: ['Python', 'Django', 'PostgreSQL', 'Chart.js'],
                tags: ['Environment', 'Tracking', 'Sustainability'],
                status: 'in-progress',
                isPublic: true,
                repoUrl: 'https://github.com/mikebuilder/ecotracker',
                metrics: {
                    views: 67,
                    likes: 14,
                    forks: 3,
                    comments: 5,
                    stars: 8
                },
                healthScore: 68
            }
        ]);
        console.log('Created projects');
        console.log('✅ Database seeded successfully!');
        console.log(`Created ${users.length} users, ${ideas.length} ideas, ${projects.length} projects, and ${badges.length} badges`);
    }
    catch (error) {
        console.error('❌ Error seeding database:', error);
    }
    finally {
        await mongoose_1.default.disconnect();
        console.log('Disconnected from MongoDB');
    }
}
seedDatabase();
