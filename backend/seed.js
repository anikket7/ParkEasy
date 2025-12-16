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
        // console.log('🚗 Creating Parking Spots...');
        // Spots creation removed as per request (no default spots)
        console.log('✨ Database seeded successfully! (Admin created, No spots added)');

        console.log('✨ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
