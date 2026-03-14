import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@company.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      console.log('Email: admin@company.com');
      console.log('Password: admin123');
      await mongoose.disconnect();
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const admin = await User.create({
      fullName: 'System Administrator',
      email: 'admin@company.com',
      password: hashedPassword,
      role: 'admin'  // ← This makes them admin!
    });

    console.log('✅ Admin user created successfully');
    console.log('Email: admin@company.com');
    console.log('Password: admin123');
    console.log('Role: admin');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error creating admin:', error);
    await mongoose.disconnect();
  }
};

createAdmin();
