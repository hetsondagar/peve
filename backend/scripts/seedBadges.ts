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

    // Create badges
    const badges = await Badge.create([
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
      },
      {
        key: 'commenter',
        name: 'Active Commenter',
        description: 'Posted 20 comments',
        icon: '💬',
        category: 'social',
        rarity: 'common',
        criteria: { 
          type: 'count',
          target: 'comments',
          threshold: 20
        },
        points: 15
      },
      {
        key: 'early_adopter',
        name: 'Early Adopter',
        description: 'Joined in the first week',
        icon: '🚀',
        category: 'special',
        rarity: 'legendary',
        criteria: { 
          type: 'custom',
          customLogic: 'joined_in_first_week'
        },
        points: 100
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
