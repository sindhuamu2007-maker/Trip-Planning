const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  timeSlot: { type: String, enum: ['Morning', 'Afternoon', 'Evening', 'Night'], default: 'Morning' },
  startTime: { type: String, default: '09:00' },
  endTime: { type: String, default: '11:30' },
  location: {
    name: { type: String, default: '' },
    lat: { type: Number, default: 15.5527 },
    lng: { type: Number, default: 73.7517 },
    address: { type: String, default: '' }
  },
  category: {
    type: String,
    enum: ['Sightseeing', 'Beach', 'Adventure', 'Food & Dining', 'Culture', 'Relaxation', 'Transit'],
    default: 'Sightseeing'
  },
  estimatedCost: { type: Number, default: 0 },
  openingHours: { type: String, default: '09:00 AM - 06:00 PM' },
  status: { type: String, enum: ['Planned', 'Confirmed', 'Completed', 'Cancelled'], default: 'Planned' },
  votesCount: { type: Number, default: 0 }
});

const DayPlanSchema = new mongoose.Schema({
  dayNumber: { type: Number, required: true },
  date: { type: Date },
  title: { type: String, default: '' },
  theme: { type: String, default: '' },
  activities: [ActivitySchema]
});

const ItinerarySchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
    unique: true
  },
  version: {
    type: Number,
    default: 1
  },
  days: [DayPlanSchema],
  aiNotes: [String],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Itinerary', ItinerarySchema);
