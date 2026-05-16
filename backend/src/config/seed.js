import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from './db.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminExists = await User.findOne({ email: 'admin@udantmartand.in' });

    if (adminExists) {
      console.log('Admin user already exists');
      process.exit();
    }

    await User.create({
      name: 'Super Admin',
      email: 'admin@udantmartand.in',
      password: 'adminpassword123', // This will be hashed by the model pre-save hook
      role: 'admin'
    });

    console.log('Admin user created successfully!');
    console.log('Email: admin@udantmartand.in');
    console.log('Password: adminpassword123');
    process.exit();
  } catch (err) {
    console.error('Error seeding admin:', err);
    process.exit(1);
  }
};

seedAdmin();
