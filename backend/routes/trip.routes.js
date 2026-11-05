const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Trip = require('../models/Trip');
const Itinerary = require('../models/Itinerary');
const Expense = require('../models/Expense');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const axios = require('axios');

// Default initial sample trips to display immediately if database is fresh
const defaultTrips = [
  {
    _id: '67c52670e9f1a23b45678911',
    title: 'Goa Coastal Adventure & Sunsets',
    destination: 'Goa, India',
    startDate: new Date(Date.now() + 86400000 * 2),
    endDate: new Date(Date.now() + 86400000 * 7),
    durationDays: 5,
    budget: {
      total: 40000,
      currency: 'INR',
      accommodation: 16000,
      transportation: 8000,
      food: 9000,
      activities: 5000,
      emergencyReserve: 2000
    },
    travelersCount: 4,
    status: 'Planning',
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    travelStyle: 'Relaxed Explorer',
    interests: ['Beaches', 'Water Sports', 'Seafood', 'Portuguese Heritage'],
    members: [
      { user: { name: 'You (Organizer)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' }, role: 'Owner' },
      { user: { name: 'Alex Johnson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80' }, role: 'Member' },
      { user: { name: 'Priya Sharma', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80' }, role: 'Member' },
      { user: { name: 'Rahul Roy', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80' }, role: 'Member' }
    ]
  },
  {
    _id: '67c52670e9f1a23b45678922',
    title: 'Himachal High Altitude Odyssey',
    destination: 'Manali & Spiti, India',
    startDate: new Date(Date.now() + 86400000 * 15),
    endDate: new Date(Date.now() + 86400000 * 21),
    durationDays: 6,
    budget: {
      total: 65000,
      currency: 'INR',
      accommodation: 22000,
      transportation: 18000,
      food: 12000,
      activities: 10000,
      emergencyReserve: 3000
    },
    travelersCount: 3,
    status: 'Planning',
    coverImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    travelStyle: 'Adventure Trekker',
    interests: ['Mountains', 'Hiking', 'Cafes', 'Photography'],
    members: [
      { user: { name: 'You (Organizer)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' }, role: 'Owner' }
    ]
  }
];

// @route   GET /api/v1/trips
// @desc    Get all trips created by the user (starts fresh)
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user?._id;
    const trips = await Trip.find({
      $or: [{ owner: userId }, { 'members.user': userId }]
    }).sort({ createdAt: -1 })
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');
    res.json({ success: true, trips });
  } catch (err) {
    console.error('[Trip List Error]', err);
    res.status(500).json({ success: false, message: 'Could not load your trips right now.' });
  }
});

// @route   DELETE /api/v1/trips/reset/all
// @desc    Manually clear trips owned by the current user
router.delete('/reset/all', protect, async (req, res) => {
  try {
    const userId = req.user?._id;
    const ownedTrips = await Trip.find({ owner: userId }).select('_id');
    const tripIds = ownedTrips.map((trip) => trip._id);
    await Promise.all([
      Trip.deleteMany({ _id: { $in: tripIds }, owner: userId }),
      Itinerary.deleteMany({ tripId: { $in: tripIds } }),
      Expense.deleteMany({ tripId: { $in: tripIds } })
    ]);
    res.json({ success: true, message: 'Your manually selected trip history was cleared.' });
  } catch (err) {
    console.error('[Trip History Clear Error]', err);
    res.status(500).json({ success: false, message: 'Could not clear your trip history right now.' });
  }
});

// @route   POST /api/v1/trips
// @desc    Create new trip
router.post('/', protect, async (req, res) => {
  try {
    const {
      title,
      destination,
      durationDays = 5,
      budget = 40000,
      travelersCount = 4,
      travelStyle = 'Balanced Explorer',
      interests = ['Sightseeing', 'Food', 'Culture'],
      daysData
    } = req.body;
    const cleanDestination = typeof destination === 'string' ? destination.trim() : '';
    const tripDuration = Number(durationDays);
    const tripBudget = Number(budget);
    const tripTravelers = Number(travelersCount);

    if (!cleanDestination) {
      return res.status(400).json({ success: false, message: 'Enter a destination before creating your trip.' });
    }
    if (!Number.isInteger(tripDuration) || tripDuration < 1 || tripDuration > 30) {
      return res.status(400).json({ success: false, message: 'Trip duration must be between 1 and 30 days.' });
    }
    if (!Number.isFinite(tripBudget) || tripBudget <= 0) {
      return res.status(400).json({ success: false, message: 'Enter a valid trip budget.' });
    }
    if (!Number.isInteger(tripTravelers) || tripTravelers < 1 || tripTravelers > 50) {
      return res.status(400).json({ success: false, message: 'Traveler count must be between 1 and 50.' });
    }
    if (!req.user?._id || !mongoose.Types.ObjectId.isValid(req.user._id)) {
      return res.status(400).json({ success: false, message: 'Unable to identify the trip organizer.' });
    }

    const newTrip = new Trip({
      title: (typeof title === 'string' && title.trim()) || `${tripDuration}-Day Trip to ${cleanDestination}`,
      destination: cleanDestination,
      durationDays: tripDuration,
      budget: {
        total: tripBudget,
        currency: 'INR',
        accommodation: Math.round(tripBudget * 0.4),
        transportation: Math.round(tripBudget * 0.2),
        food: Math.round(tripBudget * 0.225),
        activities: Math.round(tripBudget * 0.125),
        emergencyReserve: Math.round(tripBudget * 0.05)
      },
      travelersCount: tripTravelers,
      travelStyle,
      interests,
      owner: req.user._id,
      members: [{ user: req.user._id, role: 'Owner' }],
      coverImage: cleanDestination.toLowerCase().includes('goa')
        ? 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80'
        : cleanDestination.toLowerCase().includes('manali')
        ? 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80'
        : cleanDestination.toLowerCase().includes('paris')
        ? 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80'
        : cleanDestination.toLowerCase().includes('tokyo')
        ? 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80'
        : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'
    });

    const savedTrip = await newTrip.save();

    // Initialize or save itinerary
    let days = daysData;
    if (!days || days.length === 0) {
      days = Array.from({ length: tripDuration }, (_, i) => ({
        dayNumber: i + 1,
        title: `Day ${i + 1}: Discovering ${cleanDestination}`,
        theme: i === 0 ? 'Arrival & Orientation' : i === tripDuration - 1 ? 'Highlights & Departure' : 'Exploration & Culture',
        activities: [
          {
            title: `Morning Exploration in ${cleanDestination}`,
            timeSlot: 'Morning',
            startTime: '09:30',
            endTime: '12:00',
            location: { name: `${cleanDestination} Landmark` },
            category: 'Sightseeing',
            estimatedCost: 800
          },
          {
            title: `Authentic Local Dining Experience`,
            timeSlot: 'Afternoon',
            startTime: '13:00',
            endTime: '14:30',
            location: { name: 'Recommended Local Bistro' },
            category: 'Food & Dining',
            estimatedCost: 1200
          },
          {
            title: `Sunset & Cultural Stroll`,
            timeSlot: 'Evening',
            startTime: '17:00',
            endTime: '19:30',
            location: { name: 'Promenade / Viewpoint' },
            category: 'Relaxation',
            estimatedCost: 400
          }
        ]
      }));
    }

    const newItinerary = new Itinerary({
      tripId: savedTrip._id,
      version: 1,
      days,
      aiNotes: ['Plan generated with multi-agent optimization and budget balancing.']
    });

    await newItinerary.save();

    res.status(201).json({
      success: true,
      message: 'Trip plan created successfully!',
      trip: savedTrip,
      itinerary: newItinerary
    });
  } catch (err) {
    console.error('[Trip Create Error]', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/v1/trips/join/:code
// @desc    Join an existing trip using its shareable trip ID
router.post('/join/:code', protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.code)) {
      return res.status(400).json({ success: false, message: 'Enter a valid Trip ID.' });
    }

    const trip = await Trip.findById(req.params.code);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'No trip was found for that ID.' });
    }

    const userId = req.user?._id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Unable to identify your traveler account.' });
    }

    const isOwner = trip.owner && trip.owner.toString() === userId.toString();
    const isMember = trip.members.some((member) => member.user && member.user.toString() === userId.toString());
    if (!isOwner && !isMember) {
      trip.members.push({ user: userId, role: 'Member' });
      await trip.save();
    }

    res.json({ success: true, trip, message: 'You joined the trip successfully.' });
  } catch (err) {
    console.error('[Trip Join Error]', err);
    res.status(500).json({ success: false, message: 'Could not join this trip right now.' });
  }
});

// @route   POST /api/v1/trips/:id/expenses
// @desc    Record an expense for a trip member
router.post('/:id/expenses', protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Enter a valid Trip ID.' });
    }

    const userId = req.user?._id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Unable to identify your traveler account.' });
    }

    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });
    const isMember = trip.owner?.toString() === userId.toString()
      || trip.members.some((member) => member.user?.toString() === userId.toString());
    if (!isMember) return res.status(403).json({ success: false, message: 'Only trip members can record expenses.' });

    const { title, amount, category, paidBy, splitAmong } = req.body;
    const validCategories = ['Accommodation', 'Transportation', 'Food & Dining', 'Activities', 'Shopping', 'Emergency', 'Other'];
    const expenseAmount = Number(amount);
    if (typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Enter an expense title.' });
    }
    if (!Number.isFinite(expenseAmount) || expenseAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Enter a valid expense amount.' });
    }
    if (category && !validCategories.includes(category)) {
      return res.status(400).json({ success: false, message: 'Choose a valid expense category.' });
    }

    const tripPeople = [trip.owner, ...trip.members.map((member) => member.user)].filter(Boolean);
    const people = await User.find({ _id: { $in: tripPeople } }).select('name email');
    const allowedNames = [...new Set(people.map((person) => person.name || person.email).filter(Boolean))];
    const resolveMemberName = (name) => {
      if (typeof name !== 'string') return null;
      if (name.trim().toLowerCase() === 'you' && req.user?.name) {
        return allowedNames.find((memberName) => memberName.toLowerCase() === req.user.name.toLowerCase()) || null;
      }
      return allowedNames.find((memberName) => memberName.toLowerCase() === name.trim().toLowerCase()) || null;
    };
    const resolvedPaidBy = resolveMemberName(paidBy);
    if (!resolvedPaidBy) {
      return res.status(400).json({ success: false, message: 'Choose who paid from the current trip members.' });
    }

    if (splitAmong !== undefined && (!Array.isArray(splitAmong) || splitAmong.length === 0)) {
      return res.status(400).json({ success: false, message: 'Select at least one trip member to share this expense.' });
    }
    const resolvedSplitAmong = splitAmong === undefined
      ? allowedNames
      : [...new Set(splitAmong.map(resolveMemberName).filter(Boolean))];
    if (!resolvedSplitAmong.length || (splitAmong && resolvedSplitAmong.length !== new Set(splitAmong).size)) {
      return res.status(400).json({ success: false, message: 'Expense shares can only be assigned to current trip members.' });
    }

    const expense = await Expense.create({
      tripId: trip._id,
      title: title.trim(),
      amount: expenseAmount,
      category,
      paidBy: resolvedPaidBy,
      splitType: 'Equally',
      splitAmong: resolvedSplitAmong
    });
    res.status(201).json({ success: true, expense });
  } catch (err) {
    console.error('[Trip Expense Create Error]', err);
    res.status(500).json({ success: false, message: 'Could not save this expense right now.' });
  }
});

// @route   DELETE /api/v1/trips/:id/expenses/:expenseId
// @desc    Remove an expense from a trip
router.delete('/:id/expenses/:expenseId', protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id) || !mongoose.Types.ObjectId.isValid(req.params.expenseId)) {
      return res.status(400).json({ success: false, message: 'Enter a valid Trip ID and expense ID.' });
    }
    const userId = req.user?._id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Unable to identify your traveler account.' });
    }

    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });
    const isMember = trip.owner?.toString() === userId.toString()
      || trip.members.some((member) => member.user?.toString() === userId.toString());
    if (!isMember) return res.status(403).json({ success: false, message: 'Only trip members can remove expenses.' });

    const result = await Expense.deleteOne({ _id: req.params.expenseId, tripId: trip._id });
    if (!result.deletedCount) return res.status(404).json({ success: false, message: 'Expense not found for this trip.' });
    res.json({ success: true, message: 'Expense removed.' });
  } catch (err) {
    console.error('[Trip Expense Delete Error]', err);
    res.status(500).json({ success: false, message: 'Could not remove this expense right now.' });
  }
});

// @route   DELETE /api/v1/trips/:id
// @desc    Manually delete an owned trip or leave a shared trip
router.delete('/:id', protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Enter a valid Trip ID.' });
    }

    const userId = req.user?._id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Unable to identify your traveler account.' });
    }

    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'This trip is no longer available.' });
    }

    const isOwner = trip.owner && trip.owner.toString() === userId.toString();
    const isMember = trip.members.some((member) => member.user && member.user.toString() === userId.toString());
    if (!isOwner && !isMember) {
      return res.status(403).json({ success: false, message: 'You do not have access to this trip.' });
    }

    if (isOwner) {
      await Promise.all([
        Trip.deleteOne({ _id: trip._id, owner: userId }),
        Itinerary.deleteMany({ tripId: trip._id }),
        Expense.deleteMany({ tripId: trip._id })
      ]);
      return res.json({ success: true, deleted: true, message: 'Trip and its itinerary were deleted.' });
    }

    trip.members = trip.members.filter((member) => !member.user || member.user.toString() !== userId.toString());
    await trip.save();
    res.json({ success: true, deleted: false, message: 'You left the trip.' });
  } catch (err) {
    console.error('[Trip History Remove Error]', err);
    res.status(500).json({ success: false, message: 'Could not remove this trip from your history right now.' });
  }
});

// @route   GET /api/v1/trips/:id
// @desc    Get trip by ID with itinerary & expenses
router.get('/:id', protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Enter a valid Trip ID.' });
    }
    const trip = await Trip.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found.' });
    }
    const userId = req.user?._id;
    const isMember = trip.owner?._id?.toString() === userId?.toString()
      || trip.members.some((member) => member.user?._id?.toString() === userId?.toString());
    if (!isMember) return res.status(403).json({ success: false, message: 'You do not have access to this trip.' });

    let itinerary = await Itinerary.findOne({ tripId: trip._id });
    const expenses = await Expense.find({ tripId: trip._id }).sort({ date: -1 });

    res.json({
      success: true,
      trip,
      itinerary,
      expenses
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/v1/trips/:id/itinerary/activity
// @desc    Add activity to trip itinerary with real-time socket broadcast
router.post('/:id/itinerary/activity', protect, async (req, res) => {
  try {
    const { dayNumber, activity } = req.body;
    let itinerary = await Itinerary.findOne({ tripId: req.params.id });

    if (!itinerary) {
      itinerary = new Itinerary({
        tripId: req.params.id,
        version: 1,
        days: [{ dayNumber, activities: [activity] }]
      });
    } else {
      let day = itinerary.days.find(d => d.dayNumber === dayNumber);
      if (!day) {
        itinerary.days.push({ dayNumber, activities: [activity] });
      } else {
        day.activities.push(activity);
      }
      itinerary.version += 1;
      itinerary.updatedAt = new Date();
    }

    await itinerary.save();

    // Broadcast to active trip room via Socket.IO
    if (req.io) {
      req.io.to(`trip:${req.params.id}`).emit('activity-updated', {
        changeType: 'ADD',
        dayNumber,
        activity,
        version: itinerary.version
      });
    }

    res.json({ success: true, itinerary });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
