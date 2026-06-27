import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    required: true,
    trim: true
  },
  maxCapacity: {
    type: Number,
    required: true,
    min: 1
  },
  banner: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming'
  }
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
export default Event;
