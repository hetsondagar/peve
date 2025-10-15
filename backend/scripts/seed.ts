import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../src/models/User';
import { Idea } from '../src/models/Idea';
import { Project } from '../src/models/Project';
import { Badge } from '../src/models/Badge';

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI missing');
  await mongoose.connect(uri);

  await Promise.all([User.deleteMany({}), Idea.deleteMany({}), Project.deleteMany({}), Badge.deleteMany({})]);

  const adminPass = await bcrypt.hash('admin123', 12);
  const admin = await User.create({ name: 'Admin', email: 'admin@peve.dev', passwordHash: adminPass, role: 'admin', skills: ['React','Node','MongoDB'], interests: ['Web Dev','AI'] });

  const users = await User.insertMany(
    Array.from({ length: 10 }).map((_, i) => ({
      name: `User ${i+1}`,
      email: `user${i+1}@peve.dev`,
      passwordHash: adminPass,
      college: ['A','B','C'][i%3],
      skills: ['React','Node','MongoDB','Python','Web3'].slice(0, (i%5)+1),
      interests: ['Web Dev','AI','ML','Blockchain'].slice(0, (i%4)+1),
    }))
  );

  const ideas = await Idea.insertMany(
    Array.from({ length: 15 }).map((_, i) => ({
      title: `Sample Idea ${i+1}`,
      description: 'This is a seed idea',
      author: users[i % users.length]._id,
      tags: ['MERN','Campus','Productivity'].slice(0, (i%3)+1),
      status: i % 2 === 0 ? 'brainstorm' : 'want_to_build',
      likes: Math.floor(Math.random()*50),
      views: Math.floor(Math.random()*200),
      comments: Math.floor(Math.random()*20),
    }))
  );

  await Project.insertMany(
    Array.from({ length: 6 }).map((_, i) => ({
      title: `Sample Project ${i+1}`,
      description: 'This is a seed project',
      author: users[i % users.length]._id,
      techStack: ['React','Node','MongoDB','Redis'].slice(0, (i%4)+1),
      metrics: { views: Math.floor(Math.random()*500), likes: Math.floor(Math.random()*100), forks: 0, comments: Math.floor(Math.random()*40) },
      healthScore: Math.floor(Math.random()*100),
    }))
  );

  await Badge.insertMany([
    { key: 'innovator', label: 'Innovator', description: 'Post 5 ideas' },
    { key: 'team-player', label: 'Team Player', description: 'Accepted join requests >= 3' },
    { key: 'mern-wizard', label: 'MERN Wizard', description: '2 MERN projects with health > 70' },
  ]);

  // eslint-disable-next-line no-console
  console.log('Seed completed:', { admin: admin.email, users: users.length, ideas: ideas.length });
  await mongoose.disconnect();
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});


