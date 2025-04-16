import mongoose from 'mongoose';
import { log } from './vite';

// MongoDB connection
const connectToDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';
    await mongoose.connect(mongoURI);
    log('MongoDB connected successfully', 'database');
    return true;
  } catch (error) {
    log(`MongoDB connection error: ${error}`, 'database');
    return false;
  }
};

export default connectToDB;