import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import adminRoutes from './routes/admin.js';
import eventRoutes from './routes/events.js';
import registrationRoutes from './routes/registrations.js';
import { seedAdmin } from './seed/seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/event-management';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Event Management API is running' });
});

// Connect to DB and start server
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB successfully.');
    // Run DB pre-seeding
    await seedAdmin();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });
