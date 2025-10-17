import mongoose from 'mongoose';
import { Badge } from '../models/Badge';
import 'dotenv/config';

const MONGO_URI = process.env.MONGO_URI;

const badges = [
  // Achievement Badges - Project Related
  {
    key: 'first_project',
    name: 'First Steps',
    description: 'Created your first project',
    icon: '🚀',
    category: 'achievement',
    rarity: 'common',
    criteria: {
      type: 'count',
      target: 'projects',
      threshold: 1
    },
    points: 50
  },
  {
    key: 'project_master',
    name: 'Project Master',
    description: 'Created 5 projects',
    icon: '🏗️',
    category: 'achievement',
    rarity: 'rare',
    criteria: {
      type: 'count',
      target: 'projects',
      threshold: 5
    },
    points: 200
  },
  {
    key: 'project_legend',
    name: 'Project Legend',
    description: 'Created 20 projects',
    icon: '👑',
    category: 'achievement',
    rarity: 'epic',
    criteria: {
      type: 'count',
      target: 'projects',
      threshold: 20
    },
    points: 500
  },
  {
    key: 'project_god',
    name: 'Project God',
    description: 'Created 50 projects',
    icon: '⚡',
    category: 'achievement',
    rarity: 'legendary',
    criteria: {
      type: 'count',
      target: 'projects',
      threshold: 50
    },
    points: 1000
  },

  // Achievement Badges - Idea Related
  {
    key: 'first_idea',
    name: 'Idea Spark',
    description: 'Shared your first idea',
    icon: '💡',
    category: 'achievement',
    rarity: 'common',
    criteria: {
      type: 'count',
      target: 'ideas',
      threshold: 1
    },
    points: 25
  },
  {
    key: 'idea_bee',
    name: 'Idea Bee',
    description: 'Shared 10 ideas',
    icon: '🐝',
    category: 'achievement',
    rarity: 'rare',
    criteria: {
      type: 'count',
      target: 'ideas',
      threshold: 10
    },
    points: 150
  },
  {
    key: 'idea_maestro',
    name: 'Idea Maestro',
    description: 'Shared 50 ideas',
    icon: '🎭',
    category: 'achievement',
    rarity: 'epic',
    criteria: {
      type: 'count',
      target: 'ideas',
      threshold: 50
    },
    points: 400
  },
  {
    key: 'idea_genius',
    name: 'Idea Genius',
    description: 'Shared 100 ideas',
    icon: '🧠',
    category: 'achievement',
    rarity: 'legendary',
    criteria: {
      type: 'count',
      target: 'ideas',
      threshold: 100
    },
    points: 800
  },

  // Social Badges - Interaction Related
  {
    key: 'first_like',
    name: 'First Like',
    description: 'Received your first like',
    icon: '❤️',
    category: 'social',
    rarity: 'common',
    criteria: {
      type: 'count',
      target: 'likes_received',
      threshold: 1
    },
    points: 10
  },
  {
    key: 'popular_creator',
    name: 'Popular Creator',
    description: 'Received 100 likes',
    icon: '⭐',
    category: 'social',
    rarity: 'rare',
    criteria: {
      type: 'count',
      target: 'likes_received',
      threshold: 100
    },
    points: 300
  },
  {
    key: 'viral_sensation',
    name: 'Viral Sensation',
    description: 'Received 1000 likes',
    icon: '🔥',
    category: 'social',
    rarity: 'epic',
    criteria: {
      type: 'count',
      target: 'likes_received',
      threshold: 1000
    },
    points: 600
  },
  {
    key: 'legendary_creator',
    name: 'Legendary Creator',
    description: 'Received 5000 likes',
    icon: '🌟',
    category: 'social',
    rarity: 'legendary',
    criteria: {
      type: 'count',
      target: 'likes_received',
      threshold: 5000
    },
    points: 1200
  },

  // Collaboration Badges
  {
    key: 'first_collab',
    name: 'Team Player',
    description: 'Joined your first collaboration',
    icon: '🤝',
    category: 'social',
    rarity: 'common',
    criteria: {
      type: 'count',
      target: 'collaborations',
      threshold: 1
    },
    points: 75
  },
  {
    key: 'collaboration_expert',
    name: 'Collaboration Expert',
    description: 'Joined 10 collaborations',
    icon: '👥',
    category: 'social',
    rarity: 'rare',
    criteria: {
      type: 'count',
      target: 'collaborations',
      threshold: 10
    },
    points: 250
  },
  {
    key: 'collaboration_master',
    name: 'Collaboration Master',
    description: 'Joined 25 collaborations',
    icon: '🎯',
    category: 'social',
    rarity: 'epic',
    criteria: {
      type: 'count',
      target: 'collaborations',
      threshold: 25
    },
    points: 500
  },

  // Comment Badges
  {
    key: 'first_comment',
    name: 'Voice Heard',
    description: 'Made your first comment',
    icon: '💬',
    category: 'social',
    rarity: 'common',
    criteria: {
      type: 'count',
      target: 'comments',
      threshold: 1
    },
    points: 15
  },
  {
    key: 'active_commenter',
    name: 'Active Commenter',
    description: 'Made 50 comments',
    icon: '🗣️',
    category: 'social',
    rarity: 'rare',
    criteria: {
      type: 'count',
      target: 'comments',
      threshold: 50
    },
    points: 200
  },
  {
    key: 'discussion_leader',
    name: 'Discussion Leader',
    description: 'Made 200 comments',
    icon: '🎤',
    category: 'social',
    rarity: 'epic',
    criteria: {
      type: 'count',
      target: 'comments',
      threshold: 200
    },
    points: 450
  },

  // CodeTalks Badges
  {
    key: 'first_vote',
    name: 'Opinionated',
    description: 'Voted on your first CodeTalks prompt',
    icon: '🗳️',
    category: 'social',
    rarity: 'common',
    criteria: {
      type: 'count',
      target: 'votes',
      threshold: 1
    },
    points: 20
  },
  {
    key: 'active_voter',
    name: 'Active Voter',
    description: 'Voted on 20 CodeTalks prompts',
    icon: '📊',
    category: 'social',
    rarity: 'rare',
    criteria: {
      type: 'count',
      target: 'votes',
      threshold: 20
    },
    points: 150
  },
  {
    key: 'codetalks_champion',
    name: 'CodeTalks Champion',
    description: 'Voted on 100 CodeTalks prompts',
    icon: '🏆',
    category: 'social',
    rarity: 'epic',
    criteria: {
      type: 'count',
      target: 'votes',
      threshold: 100
    },
    points: 400
  },

  // Milestone Badges - Time Based
  {
    key: 'week_old',
    name: 'Week Warrior',
    description: 'Been active for 1 week',
    icon: '📅',
    category: 'milestone',
    rarity: 'common',
    criteria: {
      type: 'custom',
      customLogic: 'account_age_weeks >= 1'
    },
    points: 100
  },
  {
    key: 'month_old',
    name: 'Monthly Member',
    description: 'Been active for 1 month',
    icon: '🗓️',
    category: 'milestone',
    rarity: 'rare',
    criteria: {
      type: 'custom',
      customLogic: 'account_age_weeks >= 4'
    },
    points: 300
  },
  {
    key: 'year_old',
    name: 'Year Veteran',
    description: 'Been active for 1 year',
    icon: '🎂',
    category: 'milestone',
    rarity: 'epic',
    criteria: {
      type: 'custom',
      customLogic: 'account_age_weeks >= 52'
    },
    points: 1000
  },

  // Leaderboard Badges
  {
    key: 'top_100',
    name: 'Top 100',
    description: 'Ranked in top 100 on leaderboard',
    icon: '🥉',
    category: 'special',
    rarity: 'rare',
    criteria: {
      type: 'rank',
      threshold: 100
    },
    points: 200
  },
  {
    key: 'top_50',
    name: 'Top 50',
    description: 'Ranked in top 50 on leaderboard',
    icon: '🥈',
    category: 'special',
    rarity: 'epic',
    criteria: {
      type: 'rank',
      threshold: 50
    },
    points: 400
  },
  {
    key: 'top_10',
    name: 'Top 10',
    description: 'Ranked in top 10 on leaderboard',
    icon: '🥇',
    category: 'special',
    rarity: 'legendary',
    criteria: {
      type: 'rank',
      threshold: 10
    },
    points: 800
  },
  {
    key: 'number_one',
    name: 'Number One',
    description: 'Ranked #1 on leaderboard',
    icon: '👑',
    category: 'special',
    rarity: 'legendary',
    criteria: {
      type: 'rank',
      threshold: 1
    },
    points: 1500
  },

  // Technical Badges
  {
    key: 'profile_complete',
    name: 'Profile Complete',
    description: 'Completed your profile setup',
    icon: '✅',
    category: 'technical',
    rarity: 'common',
    criteria: {
      type: 'custom',
      customLogic: 'profile_completion >= 100'
    },
    points: 50
  },
  {
    key: 'skill_master',
    name: 'Skill Master',
    description: 'Added 10+ skills to your profile',
    icon: '🛠️',
    category: 'technical',
    rarity: 'rare',
    criteria: {
      type: 'count',
      target: 'skills',
      threshold: 10
    },
    points: 150
  },
  {
    key: 'skill_expert',
    name: 'Skill Expert',
    description: 'Added 20+ skills to your profile',
    icon: '🎯',
    category: 'technical',
    rarity: 'epic',
    criteria: {
      type: 'count',
      target: 'skills',
      threshold: 20
    },
    points: 300
  },

  // Special Badges
  {
    key: 'early_adopter',
    name: 'Early Adopter',
    description: 'Joined in the first month of launch',
    icon: '🚀',
    category: 'special',
    rarity: 'legendary',
    criteria: {
      type: 'custom',
      customLogic: 'early_adopter'
    },
    points: 2000
  },
  {
    key: 'beta_tester',
    name: 'Beta Tester',
    description: 'Helped test the platform during development',
    icon: '🧪',
    category: 'special',
    rarity: 'legendary',
    criteria: {
      type: 'custom',
      customLogic: 'beta_tester'
    },
    points: 1500
  }
];

async function seedBadges() {
  try {
    if (!MONGO_URI) {
      console.error('MONGO_URI is not set');
      process.exit(1);
    }

    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing badges
    await Badge.deleteMany({});
    console.log('Cleared existing badges');

    // Insert new badges
    const createdBadges = await Badge.insertMany(badges);
    console.log(`Created ${createdBadges.length} badges`);

    // Log badge categories
    const categories = [...new Set(badges.map(b => b.category))];
    console.log('Badge categories:', categories);

    // Log badge rarities
    const rarities = [...new Set(badges.map(b => b.rarity))];
    console.log('Badge rarities:', rarities);

    console.log('Badge seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding badges:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeder if this file is executed directly
if (require.main === module) {
  seedBadges();
}

export { seedBadges };
