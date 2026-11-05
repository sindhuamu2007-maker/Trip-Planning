const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  destination: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: () => new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
  },
  durationDays: {
    type: Number,
    default: 5
  },
  budget: {
    total: { type: Number, default: 40000 },
    currency: { type: String, default: 'INR' },
    accommodation: { type: Number, default: 16000 },
    transportation: { type: Number, default: 8000 },
    food: { type: Number, default: 9000 },
    activities: { type: Number, default: 5000 },
    emergencyReserve: { type: Number, default: 2000 }
  },
  travelersCount: {
    type: Number,
    default: 4
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  members: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      role: { type: String, enum: ['Owner', 'Administrator', 'Member'], default: 'Member' },
      joinedAt: { type: Date, default: Date.now }
    }
  ],
  coverImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80'
  },
  status: {
    type: String,
    enum: ['Planning', 'Confirmed', 'Ongoing', 'Completed'],
    default: 'Planning'
  },
  travelStyle: {
    type: String,
    default: 'Balanced'
  },
  interests: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Trip', TripSchema);
