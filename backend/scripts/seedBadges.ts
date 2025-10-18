import 'dotenv/config';
import mongoose from 'mongoose';
import { Badge } from '../src/models/Badge';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/peve';

async function seedBadges() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing badges
    await Badge.deleteMany({});
    console.log('Cleared existing badges');

    // Create comprehensive badge system (33 badges)
    const badges = await Badge.create([
      // Milestone Badges (1-10)
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
        key: 'first_idea',
        name: 'First Idea',
        description: 'Posted your first idea',
        icon: '💡',
        category: 'milestone',
        rarity: 'common',
        criteria: { 
          type: 'count',
          target: 'ideas',
          threshold: 1
        },
        points: 10
      },
      {
        key: 'first_comment',
        name: 'First Comment',
        description: 'Posted your first comment',
        icon: '💬',
        category: 'milestone',
        rarity: 'common',
        criteria: { 
          type: 'count',
          target: 'comments',
          threshold: 1
        },
        points: 5
      },
      {
        key: 'first_collaboration',
        name: 'First Collaboration',
        description: 'Joined your first collaboration',
        icon: '🤝',
        category: 'milestone',
        rarity: 'common',
        criteria: { 
          type: 'count',
          target: 'collaborations',
          threshold: 1
        },
        points: 15
      },
      {
        key: 'first_like',
        name: 'First Like',
        description: 'Received your first like',
        icon: '❤️',
        category: 'milestone',
        rarity: 'common',
        criteria: { 
          type: 'count',
          target: 'likes_received',
          threshold: 1
        },
        points: 5
      },
      {
        key: 'first_save',
        name: 'First Save',
        description: 'Someone saved your content',
        icon: '🔖',
        category: 'milestone',
        rarity: 'common',
        criteria: { 
          type: 'count',
          target: 'saves_received',
          threshold: 1
        },
        points: 8
      },
      {
        key: 'first_vote',
        name: 'First Vote',
        description: 'Voted on your first CodeTalk',
        icon: '🗳️',
        category: 'milestone',
        rarity: 'common',
        criteria: { 
          type: 'count',
          target: 'votes_cast',
          threshold: 1
        },
        points: 5
      },
      {
        key: 'profile_complete',
        name: 'Profile Complete',
        description: 'Completed your profile setup',
        icon: '✅',
        category: 'milestone',
        rarity: 'common',
        criteria: { 
          type: 'custom',
          customLogic: 'profile_complete'
        },
        points: 20
      },
      {
        key: 'skills_added',
        name: 'Skills Added',
        description: 'Added skills to your profile',
        icon: '🛠️',
        category: 'milestone',
        rarity: 'common',
        criteria: { 
          type: 'count',
          target: 'skills',
          threshold: 3
        },
        points: 15
      },
      {
        key: 'avatar_set',
        name: 'Avatar Set',
        description: 'Set your profile avatar',
        icon: '👤',
        category: 'milestone',
        rarity: 'common',
        criteria: { 
          type: 'custom',
          customLogic: 'avatar_set'
        },
        points: 10
      },

      // Achievement Badges (11-20)
      {
        key: 'project_master',
        name: 'Project Master',
        description: 'Uploaded 10 projects',
        icon: '🚀',
        category: 'achievement',
        rarity: 'rare',
        criteria: { 
          type: 'count',
          target: 'projects',
          threshold: 10
        },
        points: 50
      },
      {
        key: 'idea_master',
        name: 'Idea Master',
        description: 'Posted 10 creative ideas',
        icon: '💡',
        category: 'achievement',
        rarity: 'rare',
        criteria: { 
          type: 'count',
          target: 'ideas',
          threshold: 10
        },
        points: 40
      },
      {
        key: 'commenter',
        name: 'Active Commenter',
        description: 'Posted 50 comments',
        icon: '💬',
        category: 'achievement',
        rarity: 'rare',
        criteria: { 
          type: 'count',
          target: 'comments',
          threshold: 50
        },
        points: 30
      },
      {
        key: 'collaborator',
        name: 'Team Player',
        description: 'Joined 5 collaborations',
        icon: '🤝',
        category: 'achievement',
        rarity: 'rare',
        criteria: { 
          type: 'count',
          target: 'collaborations',
          threshold: 5
        },
        points: 40
      },
      {
        key: 'popular',
        name: 'Popular',
        description: 'Received 100+ likes',
        icon: '⭐',
        category: 'achievement',
        rarity: 'epic',
        criteria: { 
          type: 'count',
          target: 'likes_received',
          threshold: 100
        },
        points: 75
      },
      {
        key: 'bookmark_worthy',
        name: 'Bookmark Worthy',
        description: 'Your content was saved 25 times',
        icon: '🔖',
        category: 'achievement',
        rarity: 'epic',
        criteria: { 
          type: 'count',
          target: 'saves_received',
          threshold: 25
        },
        points: 60
      },
      {
        key: 'voter',
        name: 'Active Voter',
        description: 'Voted on 20 CodeTalks',
        icon: '🗳️',
        category: 'achievement',
        rarity: 'rare',
        criteria: { 
          type: 'count',
          target: 'votes_cast',
          threshold: 20
        },
        points: 25
      },
      {
        key: 'skill_expert',
        name: 'Skill Expert',
        description: 'Added 10+ skills to your profile',
        icon: '🛠️',
        category: 'achievement',
        rarity: 'rare',
        criteria: { 
          type: 'count',
          target: 'skills',
          threshold: 10
        },
        points: 35
      },
      {
        key: 'view_magnet',
        name: 'View Magnet',
        description: 'Your content received 500+ views',
        icon: '👀',
        category: 'achievement',
        rarity: 'epic',
        criteria: { 
          type: 'count',
          target: 'total_views',
          threshold: 500
        },
        points: 70
      },
      {
        key: 'early_adopter',
        name: 'Early Adopter',
        description: 'Joined in the first week',
        icon: '🚀',
        category: 'achievement',
        rarity: 'legendary',
        criteria: { 
          type: 'custom',
          customLogic: 'joined_in_first_week'
        },
        points: 100
      },

      // Social Badges (21-25)
      {
        key: 'social_butterfly',
        name: 'Social Butterfly',
        description: 'Very active in the community',
        icon: '🦋',
        category: 'social',
        rarity: 'epic',
        criteria: { 
          type: 'custom',
          customLogic: 'high_social_activity'
        },
        points: 80
      },
      {
        key: 'mentor',
        name: 'Mentor',
        description: 'Helped others in the community',
        icon: '👨‍🏫',
        category: 'social',
        rarity: 'epic',
        criteria: { 
          type: 'custom',
          customLogic: 'mentor_activity'
        },
        points: 90
      },
      {
        key: 'networker',
        name: 'Networker',
        description: 'Connected with many users',
        icon: '🌐',
        category: 'social',
        rarity: 'rare',
        criteria: { 
          type: 'count',
          target: 'connections',
          threshold: 20
        },
        points: 45
      },
      {
        key: 'helper',
        name: 'Helper',
        description: 'Always ready to help others',
        icon: '🤲',
        category: 'social',
        rarity: 'rare',
        criteria: { 
          type: 'custom',
          customLogic: 'helpful_activity'
        },
        points: 40
      },
      {
        key: 'community_champion',
        name: 'Community Champion',
        description: 'Top contributor to the community',
        icon: '🏆',
        category: 'social',
        rarity: 'legendary',
        criteria: { 
          type: 'custom',
          customLogic: 'top_contributor'
        },
        points: 150
      },

      // Technical Badges (26-30)
      {
        key: 'tech_expert',
        name: 'Tech Expert',
        description: 'Expert in multiple technologies',
        icon: '⚡',
        category: 'technical',
        rarity: 'epic',
        criteria: { 
          type: 'count',
          target: 'skills',
          threshold: 15
        },
        points: 85
      },
      {
        key: 'fullstack',
        name: 'Full Stack',
        description: 'Proficient in both frontend and backend',
        icon: '🔧',
        category: 'technical',
        rarity: 'rare',
        criteria: { 
          type: 'custom',
          customLogic: 'fullstack_skills'
        },
        points: 60
      },
      {
        key: 'innovator',
        name: 'Innovator',
        description: 'Created innovative projects',
        icon: '💡',
        category: 'technical',
        rarity: 'epic',
        criteria: { 
          type: 'custom',
          customLogic: 'innovative_projects'
        },
        points: 75
      },
      {
        key: 'code_reviewer',
        name: 'Code Reviewer',
        description: 'Active in code reviews',
        icon: '🔍',
        category: 'technical',
        rarity: 'rare',
        criteria: { 
          type: 'custom',
          customLogic: 'code_review_activity'
        },
        points: 50
      },
      {
        key: 'open_source',
        name: 'Open Source',
        description: 'Contributed to open source projects',
        icon: '📂',
        category: 'technical',
        rarity: 'epic',
        criteria: { 
          type: 'custom',
          customLogic: 'open_source_contributor'
        },
        points: 80
      },

      // Special Badges (31-33)
      {
        key: 'legend',
        name: 'Legend',
        description: 'Achieved legendary status',
        icon: '👑',
        category: 'special',
        rarity: 'legendary',
        criteria: { 
          type: 'custom',
          customLogic: 'legendary_status'
        },
        points: 200
      },
      {
        key: 'founder',
        name: 'Founder',
        description: 'One of the first users',
        icon: '🌟',
        category: 'special',
        rarity: 'legendary',
        criteria: { 
          type: 'custom',
          customLogic: 'founder_status'
        },
        points: 300
      },
      {
        key: 'perfect_score',
        name: 'Perfect Score',
        description: 'Achieved perfect compatibility score',
        icon: '💯',
        category: 'special',
        rarity: 'legendary',
        criteria: { 
          type: 'custom',
          customLogic: 'perfect_compatibility'
        },
        points: 250
      }
    ]);

    console.log(`✅ Created ${badges.length} badges successfully!`);
    return badges.length;
  } catch (error) {
    console.error('❌ Error seeding badges:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedBadges()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { seedBadges };
