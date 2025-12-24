import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import ParkingSpot from '../models/ParkingSpot.js';
import User from '../models/User.js';
import BookingHistory from '../models/BookingHistory.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';
// Booking history endpoint with ObjectId conversion

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Get all parking spots
router.get('/', async (req, res) => {
  try {
    const spots = await ParkingSpot.find().populate('bookedBy', 'name email').sort({ spotNumber: 1 });
    res.json(spots);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get available parking spots
router.get('/available', async (req, res) => {
  try {
    const spots = await ParkingSpot.find({ isAvailable: true }).sort({ spotNumber: 1 });
    res.json(spots);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single parking spot
router.get('/:id', async (req, res) => {
  try {
    const spot = await ParkingSpot.findById(req.params.id).populate('bookedBy', 'name email');
    if (!spot) {
      return res.status(404).json({ message: 'Parking spot not found' });
    }
    res.json(spot);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create parking spot (Admin only)
router.post('/', authenticateToken, [
  body('spotNumber').trim().notEmpty().withMessage('Spot number is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('pricePerHour').isNumeric().withMessage('Price must be a number'),
  body('pricePerHour').isFloat({ min: 0 }).withMessage('Price must be positive'),
  body('totalSpots').optional().isInt({ min: 1 }).withMessage('Total spots must be at least 1')
], async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, spotNumber, location, pricePerHour, vehicleType, totalSpots = 1, pricing, features } = req.body;

    // Check if spot number already exists
    const existingSpot = await ParkingSpot.findOne({ spotNumber });
    if (existingSpot) {
      return res.status(400).json({ message: 'Parking spot with this number already exists' });
    }

    const spot = new ParkingSpot({
      name: name || `Spot ${spotNumber}`,
      spotNumber,
      location,
      pricePerHour,
      vehicleType: vehicleType || 'Any',
      totalSpots,
      availableSpots: totalSpots,
      pricing: pricing || {},
      features: features || []
    });

    await spot.save();
    res.status(201).json(spot);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update parking spot (Admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const spot = await ParkingSpot.findById(req.params.id);
    if (!spot) {
      return res.status(404).json({ message: 'Parking spot not found' });
    }

    const {
      name,
      spotNumber,
      location,
      pricePerHour,
      pricePerDay,
      pricePerMonth,
      vehicleType,
      isAvailable,
      totalSpots,
      availableSpots,
      pricing,
      features
    } = req.body;

    // Update basic fields
    if (name !== undefined) spot.name = name;
    if (spotNumber) spot.spotNumber = spotNumber;
    if (location) spot.location = location;
    if (pricePerHour !== undefined) spot.pricePerHour = pricePerHour;
    if (pricePerDay !== undefined) spot.pricePerDay = pricePerDay;
    if (pricePerMonth !== undefined) spot.pricePerMonth = pricePerMonth;
    if (vehicleType) spot.vehicleType = vehicleType;
    if (isAvailable !== undefined) spot.isAvailable = isAvailable;
    if (pricing !== undefined) spot.pricing = pricing;
    if (features !== undefined) spot.features = features;

    // Handle totalSpots and availableSpots
    if (totalSpots !== undefined) {
      const oldTotal = spot.totalSpots || 1;
      const oldAvailable = spot.availableSpots ?? (spot.isAvailable ? oldTotal : 0);
      const bookedSpots = oldTotal - oldAvailable;

      spot.totalSpots = totalSpots;
      // Adjust availableSpots to maintain the same number of booked spots
      spot.availableSpots = Math.max(0, totalSpots - bookedSpots);
    }

    if (availableSpots !== undefined) {
      spot.availableSpots = availableSpots;
    }

    await spot.save();
    res.json(spot);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Book parking spot
router.post('/:id/book', authenticateToken, [
  body('startTime').isISO8601().toDate().withMessage('Valid start time is required'),
  body('endTime').isISO8601().toDate().withMessage('Valid end time is required'),
  body('spotsToBook').optional().isInt({ min: 1 }).withMessage('Spots to book must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const spot = await ParkingSpot.findById(req.params.id);
    if (!spot) {
      return res.status(404).json({ message: 'Parking spot not found' });
    }

    const { startTime, endTime, spotsToBook = 1, vehicleType = 'car' } = req.body;

    // Validate times
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (start < now) {
      return res.status(400).json({ message: 'Start time cannot be in the past' });
    }

    if (end <= start) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    // Calculate duration in hours
    const durationMs = end - start;
    const durationHours = durationMs / (1000 * 60 * 60);

    // Check if enough spots are available
    const available = spot.availableSpots ?? (spot.isAvailable ? spot.totalSpots || 1 : 0);
    if (available < spotsToBook) {
      return res.status(400).json({ message: `Only ${available} spot(s) available` });
    }

    // Determine price based on vehicle type
    let pricePerHour = spot.pricePerHour || 0;
    if (spot.pricing && spot.pricing[vehicleType] && spot.pricing[vehicleType].hourly) {
      pricePerHour = spot.pricing[vehicleType].hourly;
    }

    // Update availability
    spot.availableSpots = available - spotsToBook;
    spot.isAvailable = spot.availableSpots > 0;
    spot.bookedBy = req.user.id;
    spot.bookedSpots = spotsToBook;
    spot.bookedAt = start;
    spot.bookedUntil = end;

    await spot.save();

    // Generate 5-digit random entry code
    const entryCode = Math.floor(10000 + Math.random() * 90000).toString();

    // Create booking history record
    const bookingHistory = await BookingHistory.create({
      userId: req.user.id,
      parkingSpotId: spot._id,
      parkingSpotName: spot.name || `Spot ${spot.spotNumber}`,
      location: spot.location,
      bookedSpots: spotsToBook,
      pricePerHour: pricePerHour,
      totalAmount: pricePerHour * spotsToBook * durationHours,
      bookedAt: start,
      bookedUntil: end,
      entryCode: entryCode,
      status: 'active'
    });

    const populatedSpot = await ParkingSpot.findById(spot._id).populate('bookedBy', 'name email');
    res.json({
      ...populatedSpot.toObject(),
      totalAmount: pricePerHour * spotsToBook * durationHours,
      entryCode: entryCode,
      bookingId: bookingHistory._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Release parking spot
router.post('/:id/release', authenticateToken, async (req, res) => {
  try {
    const spot = await ParkingSpot.findById(req.params.id);
    if (!spot) {
      return res.status(404).json({ message: 'Parking spot not found' });
    }

    // Convert both to strings for comparison
    // const spotBookedBy = spot.bookedBy ? spot.bookedBy.toString() : null;
    // const currentUserId = req.user.id;

    // Remove legacy single-tenant check. We now verify ownership via BookingHistory below.
    // if ((!spot.bookedBy || spotBookedBy !== currentUserId) && req.user.role !== 'admin') {
    //   return res.status(403).json({ message: 'You can only release your own bookings' });
    // }

    // Get status from request body (default to 'released' if not provided)
    const status = req.body.status || 'released';
    const validStatuses = ['cancelled', 'released', 'completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Build filter for updating booking status
    const filter = {
      parkingSpotId: spot._id,
      userId: req.user.id, // Ensure we only touch bookings for this user (unless admin logic handles override)
      status: 'active'
    };

    // If bookingId is provided, target that specific booking
    if (req.body.bookingId) {
      filter._id = req.body.bookingId;
    }

    // Find the bookings we are about to cancel to know how many spots to restore
    const bookingsToCancel = await BookingHistory.find(filter);

    if (!bookingsToCancel || bookingsToCancel.length === 0) {
      // If no active booking matches (e.g. already cancelled), just return success or info
      return res.json({ message: 'No active booking found to release' });
    }

    // Calculate total spots to restore from these specific bookings
    const spotsToRestore = bookingsToCancel.reduce((sum, b) => sum + (b.bookedSpots || 1), 0);

    // Mark booking history as completed/cancelled/released
    await BookingHistory.updateMany(
      filter,
      {
        status: status,
        releasedAt: new Date()
      }
    );

    // Update Parking Spot counts
    spot.availableSpots = Math.min(spot.totalSpots, (spot.availableSpots || 0) + spotsToRestore);

    if (spot.bookedSpots > 0) {
      spot.bookedSpots = Math.max(0, spot.bookedSpots - spotsToRestore);
    }

    spot.isAvailable = spot.availableSpots > 0;

    // Only clear ownership if no spots are booked at all
    if (spot.bookedSpots === 0) {
      spot.bookedBy = null;
      spot.bookedAt = null;
      spot.bookedUntil = null;
    }

    await spot.save();
    res.json(spot);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete parking spot (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const spot = await ParkingSpot.findByIdAndDelete(req.params.id);
    if (!spot) {
      return res.status(404).json({ message: 'Parking spot not found' });
    }
    res.json({ message: 'Parking spot deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



// Get user's booking history
router.get('/history/user', authenticateToken, async (req, res) => {
  try {
    // Convert string ID to ObjectId for MongoDB comparison
    const userObjectId = new mongoose.Types.ObjectId(req.user.id);

    const history = await BookingHistory.find({ userId: userObjectId })
      .populate('parkingSpotId')
      .sort({ bookedAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all active bookings (Admin only)
router.get('/bookings/all', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const bookings = await BookingHistory.find()
      .populate('userId', 'name email userId')
      .populate('parkingSpotId', 'spotNumber location')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;




