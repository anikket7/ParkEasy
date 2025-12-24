import mongoose from 'mongoose';

const parkingSpotSchema = new mongoose.Schema({
  // Parking Place Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  spotNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },

  // Capacity Information
  totalSpots: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  availableSpots: {
    type: Number,
    required: true,
    min: 0
  },

  // Pricing Information - Hourly Only
  pricing: {
    bike: {
      hourly: { type: Number, min: 0 }
    },
    car: {
      hourly: { type: Number, min: 0 }
    },
    bus: {
      hourly: { type: Number, min: 0 }
    },
    truck: {
      hourly: { type: Number, min: 0 }
    }
  },

  // Legacy pricing (for backward compatibility)
  pricePerHour: {
    type: Number,
    min: 0
  },

  // Availability
  isAvailable: {
    type: Boolean,
    default: true
  },
  vehicleType: {
    type: String,
    enum: ['Car', 'Motorcycle', 'Truck', 'Any', 'Bike', 'Bus'],
    default: 'Any'
  },

  // Features
  features: [{
    type: String,
    enum: ['cctv', 'security', 'lighting', 'covered', 'ev_charging', 'wheelchair_accessible', 'valet', 'car_wash', '24/7']
  }],

  // Booking Information
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  bookedSpots: {
    type: Number,
    default: 0,
    min: 0
  },
  bookedAt: {
    type: Date,
    default: null
  },
  bookedUntil: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

const ParkingSpot = mongoose.model('ParkingSpot', parkingSpotSchema);
export default ParkingSpot;




