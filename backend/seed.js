import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import ParkingSpot from './models/ParkingSpot.js';
import BookingHistory from './models/BookingHistory.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/parkeasy';

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('📦 Connected to MongoDB...');

        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await User.deleteMany({});
        await ParkingSpot.deleteMany({});
        await BookingHistory.deleteMany({});

        // Create Admin User
        console.log('👑 Creating Admin User...');
        // Manually hash password since we are bypassing the pre-save hook partially or using insertMany/save
        // But using new User() + save() triggers the pre-save hook which handles hashing.
        const adminUser = new User({
            name: 'System Admin',
            email: 'admin@parkeasy.in',
            password: 'admin@1234', // Will be hashed by pre-save hook
            role: 'admin',
            userId: '00001'
        });
        await adminUser.save();
        console.log('   ✅ Admin created: admin@parkeasy.in / admin@1234');



        // Create Parking Spots
        console.log('🚗 Creating Parking Spots...');
        const spots = [
            {
                name: 'Premium Spot A1',
                spotNumber: 'A1',
                location: 'Level 1, Near Entrance',
                totalSpots: 1,
                availableSpots: 1,
                vehicleType: 'Car',
                pricing: {
                    car: { hourly: 50, daily: 500, monthly: 10000 }
                },
                pricePerHour: 50,
                features: ['cctv', 'covered', 'lighting']
            },
            {
                name: 'Bike Zone B1',
                spotNumber: 'B1',
                location: 'Level 1, Bike Zone',
                totalSpots: 10,
                availableSpots: 10,
                vehicleType: 'Bike',
                pricing: {
                    bike: { hourly: 15, daily: 100, monthly: 2000 }
                },
                pricePerHour: 15,
                features: ['cctv', 'security']
            },
            {
                name: 'EV Station E1',
                spotNumber: 'E1',
                location: 'Level 2, EV Charging',
                totalSpots: 2,
                availableSpots: 2,
                vehicleType: 'Car',
                pricing: {
                    car: { hourly: 80, daily: 800, monthly: 15000 }
                },
                pricePerHour: 80,
                features: ['ev_charging', 'covered', 'cctv']
            }
        ];

        await ParkingSpot.insertMany(spots);
        console.log(`   ✅ Created ${spots.length} parking spots`);

        console.log('✨ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
