import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Get connection string from .env
const MONGODB_URI = process.env.MONGODB_URI;

// Check if connection string exists
if (!MONGODB_URI) {
    throw new Error('❌ MONGODB_URI is not defined in .env file!');
}

console.log('📝 Using MongoDB Atlas');

// ============ CONNECT TO MONGODB ATLAS ============

export async function connectToDatabase(): Promise<void> {
    try {
        console.log('🔌 Connecting to MongoDB Atlas...');

        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI!);

        console.log('✅ Connected to MongoDB Atlas!');
        console.log(`📦 Database: shop-api`);

    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        throw error;
    }
}

// ============ DISCONNECT FROM MONGODB ============

export async function disconnectFromDatabase(): Promise<void> {
    try {
        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');
    } catch (error) {
        console.error('❌ Disconnect error:', error);
        throw error;
    }
}

// Export mongoose for use in other files
export default mongoose;