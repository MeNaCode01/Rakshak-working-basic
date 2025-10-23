import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        console.log('Testing MongoDB connection...');
        console.log('URI:', mongoURI ? mongoURI.split('@')[1]?.split('?')[0] : 'NOT FOUND');
        
        await mongoose.connect(mongoURI);
        console.log('✅ SUCCESS! Connected to MongoDB Atlas');
        console.log('Database:', mongoose.connection.db.databaseName);
        
        await mongoose.connection.close();
        console.log('Connection closed');
        process.exit(0);
    } catch (error) {
        console.log('❌ FAILED to connect');
        console.log('Error:', error.message);
        process.exit(1);
    }
};

testConnection();
