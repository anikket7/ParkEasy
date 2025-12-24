import mongoose from 'mongoose';

const bookingHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parkingSpotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParkingSpot',
        required: true
    },
    parkingSpotName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    bookedSpots: {
        type: Number,
        required: true,
        min: 1
    },
    pricePerHour: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    bookedAt: {
        type: Date,
        required: true
    },
    bookedUntil: {
        type: Date,
        required: true
    },
    releasedAt: {
        type: Date,
        default: null
    },
    entryCode: {
        type: String,
        required: true,
        length: 5
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled', 'released'],
        default: 'active'
    }
}, {
    timestamps: true
});

const BookingHistory = mongoose.model('BookingHistory', bookingHistorySchema);
export default BookingHistory;
