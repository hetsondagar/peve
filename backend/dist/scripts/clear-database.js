"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const MONGO_URI = process.env.MONGO_URI || '';
async function clearDatabase() {
    try {
        console.log('🔗 Connecting to MongoDB...');
        await mongoose_1.default.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');
        const db = mongoose_1.default.connection.db;
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
            }
            catch (error) {
                console.error(`❌ Error clearing ${collectionName}:`, error);
            }
        }
        console.log('🎉 Database cleared successfully!');
        console.log('📊 All collections have been emptied');
    }
    catch (error) {
        console.error('❌ Error clearing database:', error);
    }
    finally {
        await mongoose_1.default.connection.close();
        console.log('🔌 Database connection closed');
        process.exit(0);
    }
}
clearDatabase();
