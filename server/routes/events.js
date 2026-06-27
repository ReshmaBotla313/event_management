import express from 'express';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all events - Public
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    const eventsWithCount = await Promise.all(
      events.map(async (event) => {
        const count = await Registration.countDocuments({ event: event._id });
        return {
          ...event.toObject(),
          registeredCount: count
        };
      })
    );
    res.json(eventsWithCount);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Failed to retrieve events.' });
  }
});

// GET single event by ID - Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }
    const count = await Registration.countDocuments({ event: event._id });
    res.json({
      ...event.toObject(),
      registeredCount: count
    });
  } catch (error) {
    console.error('Error fetching event details:', error);
    res.status(500).json({ message: 'Failed to retrieve event details.' });
  }
});

// POST create event - Admin Only
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, category, date, time, venue, maxCapacity, banner, status } = req.body;

  if (!title || !description || !category || !date || !time || !venue || !maxCapacity) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const newEvent = new Event({
      title,
      description,
      category,
      date,
      time,
      venue,
      maxCapacity,
      banner,
      status: status || 'upcoming'
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Failed to create event.' });
  }
});

// PUT edit event - Admin Only
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, description, category, date, time, venue, maxCapacity, banner, status } = req.body;

  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    if (title) event.title = title;
    if (description) event.description = description;
    if (category) event.category = category;
    if (date) event.date = date;
    if (time) event.time = time;
    if (venue) event.venue = venue;
    if (maxCapacity) event.maxCapacity = maxCapacity;
    if (banner) event.banner = banner;
    if (status) event.status = status;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Failed to update event.' });
  }
});

// DELETE event - Admin Only
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    await Event.findByIdAndDelete(req.params.id);
    // Delete associated registrations to keep DB consistent
    await Registration.deleteMany({ event: req.params.id });

    res.json({ message: 'Event and associated registrations successfully deleted.' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Failed to delete event.' });
  }
});

export default router;
