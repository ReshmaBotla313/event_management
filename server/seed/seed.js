import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/event-management';

export const seedAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: 'admin@college.com' });
    if (existingAdmin) {
      console.log('Admin account already exists.');
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new Admin({
      email: 'admin@college.com',
      password: hashedPassword
    });

    await admin.save();
    console.log('Admin account successfully pre-seeded (admin@college.com / admin123).');
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};

// Check if run directly
const isDirectRun = process.argv[1] && (process.argv[1].endsWith('seed.js') || process.argv[1].endsWith('seed'));
if (isDirectRun) {
  const runSeed = async () => {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log('Connected to MongoDB for seeding...');
      await seedAdmin();
    } catch (err) {
      console.error('Connection/seed failed:', err);
    } finally {
      await mongoose.connection.close();
      console.log('MongoDB connection closed.');
    }
  };
  runSeed();
}
