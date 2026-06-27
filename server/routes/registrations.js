import express from 'express';
import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// POST register for an event - Public
router.post('/:eventId', async (req, res) => {
  const { eventId } = req.params;
  const { name, rollNumber, year, branch } = req.body;

  // Validation
  if (!name || !rollNumber || !year || !branch) {
    return res.status(400).json({ message: 'All fields (Name, Roll Number, Year, Branch) are required.' });
  }

  try {
    // 1. Check if the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // 2. Check if event is completed
    if (event.status === 'completed') {
      return res.status(400).json({ message: 'Cannot register for a completed event.' });
    }

    // 3. Check duplicate registration for this event
    const existingRegistration = await Registration.findOne({ event: eventId, rollNumber: rollNumber.trim().toUpperCase() });
    if (existingRegistration) {
      return res.status(400).json({ message: 'Roll number already registered for this event.' });
    }

    // 4. Check if event capacity is full
    const registrationCount = await Registration.countDocuments({ event: eventId });
    if (registrationCount >= event.maxCapacity) {
      return res.status(400).json({ message: 'Registration failed. Event is already full.' });
    }

    // 5. Create registration
    const newRegistration = new Registration({
      event: eventId,
      name,
      rollNumber: rollNumber.trim().toUpperCase(),
      year,
      branch
    });

    await newRegistration.save();
    res.status(201).json({ message: 'Registered successfully!' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Failed to complete registration.' });
  }
});

// GET all registrations for a specific event - Admin Only
router.get('/event/:eventId', authMiddleware, async (req, res) => {
  const { eventId } = req.params;

  try {
    const registrations = await Registration.find({ event: eventId }).sort({ registeredAt: -1 });
    res.json(registrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ message: 'Failed to retrieve registrations.' });
  }
});

export default router;
