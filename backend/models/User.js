const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    default: 'Traveler'
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  preferences: {
    preferredDestinations: {
      type: [String],
      default: ['Goa', 'Himachal', 'Paris', 'Tokyo']
    },
    travelInterests: {
      type: [String],
      default: ['Beaches', 'Adventure', 'Food & Dining', 'Culture & History']
    },
    budgetRange: {
      type: String,
      enum: ['Budget', 'Moderate', 'Luxury'],
      default: 'Moderate'
    },
    preferredAccommodation: {
      type: String,
      default: 'Boutique Hotel / Villa'
    },
    foodPreferences: {
      type: String,
      default: 'Local Specialties & Vegetarian-friendly'
    },
    travelStyle: {
      type: String,
      default: 'Explorer'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to verify password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
