const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Project = require('../models/Project');
const Achievement = require('../models/Achievement');
const Event = require('../models/Event');

// Sample data
const sampleUsers = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    title: 'Full Stack Developer',
    company: 'Tech Corp',
    experience: 'Senior Level',
    bio: 'Passionate developer with 5+ years of experience in web development.',
    location: 'San Francisco, CA',
    skills: [
      { name: 'JavaScript', level: 5, category: 'Technical' },
      { name: 'React', level: 4, category: 'Technical' },
      { name: 'Node.js', level: 4, category: 'Technical' },
      { name: 'Python', level: 3, category: 'Technical' }
    ]
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    password: 'password123',
    title: 'UI/UX Designer',
    company: 'Design Studio',
    experience: 'Mid Level',
    bio: 'Creative designer focused on user experience and interface design.',
    location: 'New York, NY',
    skills: [
      { name: 'Figma', level: 5, category: 'Design' },
      { name: 'Adobe XD', level: 4, category: 'Design' },
      { name: 'User Research', level: 4, category: 'Design' },
      { name: 'Prototyping', level: 3, category: 'Design' }
    ]
  },
  {
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@example.com',
    password: 'password123',
    title: 'Data Scientist',
    company: 'Data Analytics Inc',
    experience: 'Senior Level',
    bio: 'Data scientist with expertise in machine learning and analytics.',
    location: 'Seattle, WA',
    skills: [
      { name: 'Python', level: 5, category: 'Technical' },
      { name: 'Machine Learning', level: 5, category: 'Technical' },
      { name: 'SQL', level: 4, category: 'Technical' },
      { name: 'Statistics', level: 4, category: 'Technical' }
    ]
  }
];

const sampleProjects = [
  {
    title: 'E-commerce Platform',
    description: 'A modern e-commerce platform built with React and Node.js, featuring real-time inventory management and payment processing.',
    shortDescription: 'Modern e-commerce platform with React and Node.js',
    category: 'Web Development',
    tags: ['react', 'nodejs', 'ecommerce', 'mongodb'],
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    status: 'In Progress',
    progress: 65,
    collaborationType: 'Open',
    maxMembers: 5,
    requiredSkills: [
      { name: 'React', level: 3 },
      { name: 'Node.js', level: 3 },
      { name: 'MongoDB', level: 2 }
    ]
  },
  {
    title: 'Mobile Fitness App',
    description: 'A cross-platform mobile app for fitness tracking with social features and workout plans.',
    shortDescription: 'Cross-platform fitness tracking app',
    category: 'Mobile App',
    tags: ['react-native', 'fitness', 'mobile', 'social'],
    technologies: ['React Native', 'Firebase', 'Redux'],
    status: 'Planning',
    progress: 20,
    collaborationType: 'Invite Only',
    maxMembers: 4,
    requiredSkills: [
      { name: 'React Native', level: 4 },
      { name: 'Firebase', level: 3 },
      { name: 'Redux', level: 3 }
    ]
  }
];

const sampleAchievements = [
  {
    name: 'First Connection',
    description: 'Make your first connection on the platform',
    icon: '🤝',
    category: 'Social',
    rarity: 'Common',
    points: 10,
    requirements: {
      type: 'automatic',
      criteria: {
        connections: 1
      }
    }
  },
  {
    name: 'Project Creator',
    description: 'Create your first project',
    icon: '🚀',
    category: 'Technical',
    rarity: 'Common',
    points: 15,
    requirements: {
      type: 'automatic',
      criteria: {
        projects: 1
      }
    }
  },
  {
    name: 'Social Butterfly',
    description: 'Send 100 messages',
    icon: '💬',
    category: 'Social',
    rarity: 'Uncommon',
    points: 25,
    requirements: {
      type: 'automatic',
      criteria: {
        messages: 100
      }
    }
  },
  {
    name: 'Skill Master',
    description: 'Have 10 skills with level 4 or higher',
    icon: '🎯',
    category: 'Technical',
    rarity: 'Rare',
    points: 50,
    requirements: {
      type: 'automatic',
      criteria: {
        skills: 10
      }
    }
  }
];

const sampleEvents = [
  {
    title: 'React Workshop 2024',
    description: 'Learn advanced React patterns and best practices in this hands-on workshop.',
    shortDescription: 'Advanced React patterns and best practices',
    type: 'Workshop',
    category: 'Technology',
    tags: ['react', 'javascript', 'frontend', 'workshop'],
    organizer: {
      name: 'Tech Community',
      email: 'events@techcommunity.com',
      website: 'https://techcommunity.com'
    },
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 4 hours later
    duration: 240, // 4 hours
    location: {
      type: 'online',
      onlineLink: 'https://zoom.us/j/123456789',
      platform: 'Zoom'
    },
    maxAttendees: 50,
    isRegistrationRequired: true,
    pricing: {
      type: 'free'
    },
    status: 'Published'
  },
  {
    title: 'AI/ML Hackathon',
    description: '48-hour hackathon focused on AI and machine learning solutions.',
    shortDescription: '48-hour AI/ML hackathon',
    type: 'Hackathon',
    category: 'Technology',
    tags: ['ai', 'ml', 'hackathon', 'python'],
    organizer: {
      name: 'AI Community',
      email: 'hackathon@aicommunity.com',
      website: 'https://aicommunity.com'
    },
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    endDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000), // 48 hours later
    duration: 2880, // 48 hours
    location: {
      type: 'physical',
      address: '123 Tech Street',
      city: 'San Francisco',
      country: 'USA'
    },
    maxAttendees: 100,
    isRegistrationRequired: true,
    pricing: {
      type: 'free'
    },
    status: 'Published'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/peve');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Achievement.deleteMany({});
    await Event.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const users = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      users.push(user);
    }
    console.log(`👥 Created ${users.length} users`);

    // Create achievements
    const achievements = [];
    for (const achievementData of sampleAchievements) {
      const achievement = new Achievement(achievementData);
      await achievement.save();
      achievements.push(achievement);
    }
    console.log(`🏆 Created ${achievements.length} achievements`);

    // Create projects
    const projects = [];
    for (let i = 0; i < sampleProjects.length; i++) {
      const projectData = {
        ...sampleProjects[i],
        owner: users[i % users.length]._id
      };
      const project = new Project(projectData);
      await project.save();
      
      // Add owner as member
      await project.addMember(users[i % users.length]._id, 'Owner');
      projects.push(project);
    }
    console.log(`🚀 Created ${projects.length} projects`);

    // Create events
    const events = [];
    for (const eventData of sampleEvents) {
      const event = new Event(eventData);
      await event.save();
      events.push(event);
    }
    console.log(`📅 Created ${events.length} events`);

    // Update user stats
    for (const user of users) {
      user.stats.projects = 1; // Each user owns 1 project
      user.stats.achievements = 0;
      user.stats.connections = 0;
      await user.save();
    }
    console.log('📊 Updated user stats');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\nSample accounts:');
    sampleUsers.forEach(user => {
      console.log(`Email: ${user.email}, Password: password123`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seeder
seedDatabase();
