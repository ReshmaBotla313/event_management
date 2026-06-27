import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';
    const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, {
      expiresIn: '24h'
    });

    res.json({ token, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// GET stats - Admin Only
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalRegistrations = await Registration.countDocuments();
    res.json({ totalEvents, totalRegistrations });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Failed to retrieve stats.' });
  }
});

export default router;

