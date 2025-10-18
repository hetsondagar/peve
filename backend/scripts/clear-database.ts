import 'dotenv/config';
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || '';

async function clearDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    const collections = await db.listCollections().toArray();
    console.log(`📋 Found ${collections.length} collections`);

    for (const collection of collections) {
      const collectionName = collection.name;
      console.log(`🗑️  Clearing collection: ${collectionName}`);
      
      try {
        await db.collection(collectionName).deleteMany({});
        console.log(`✅ Cleared ${collectionName}`);
      } catch (error) {
        console.error(`❌ Error clearing ${collectionName}:`, error);
      }
    }

    console.log('🎉 Database cleared successfully!');
    console.log('📊 All collections have been emptied');
    
  } catch (error) {
    console.error('❌ Error clearing database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

clearDatabase();
