import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  rollNumber: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: String,
    required: true,
    enum: ['1st', '2nd', '3rd']
  },
  branch: {
    type: String,
    required: true,
    trim: true
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure a student can only register once per event
registrationSchema.index({ event: 1, rollNumber: 1 }, { unique: true });

const Registration = mongoose.model('Registration', registrationSchema);
export default Registration;
