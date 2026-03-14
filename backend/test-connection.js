import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected successfully!');
    console.log('Connection host:', conn.connection.host);
    
    await mongoose.disconnect();
    console.log('✅ Disconnected successfully');
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.error('Error details:', error);
  }
};

testConnection();
