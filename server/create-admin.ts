import mongoose from 'mongoose';
import UserModel from './models/User';
import bcrypt from 'bcryptjs';
import connectToDB from './db';

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await connectToDB();
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await UserModel.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists. Updating password...');
      // Update password
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await UserModel.updateOne(
        { username: 'admin' },
        { $set: { password: hashedPassword, isAdmin: true } }
      );
    } else {
      console.log('Creating new admin user...');
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await UserModel.create({
        username: 'admin',
        password: hashedPassword,
        isAdmin: true
      });
    }

    console.log('Admin user created/updated successfully');
    console.log('Username: admin');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createAdminUser();