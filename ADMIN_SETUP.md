# Admin User Setup Guide

## ⚠️ Important Security Note

**Admin accounts CANNOT be created through the browser signup form.** This is a security feature. Admin users must be created directly in the database.

## How to Create an Admin User

Admin users must be created directly in MongoDB. Here are the available methods:

### Method 1: Using MongoDB Shell (Recommended)

If you have MongoDB shell access, you can create an admin user directly:

```javascript
// Connect to MongoDB
use parkeasy

// Create admin user (password will be hashed automatically)
db.users.insertOne({
  name: "Admin User",
  email: "admin@parking.com",
  password: "$2a$10$...", // Use bcrypt to hash your password
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**Note:** You'll need to hash the password using bcrypt. You can use an online bcrypt generator or Node.js to hash your password.

### Method 2: Using Node.js Script (Temporary)

You can create a temporary script to create an admin user:

```javascript
// create-admin-temp.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/parking-system';

async function createAdmin() {
  await mongoose.connect(MONGODB_URI);
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = new User({
    name: 'Admin User',
    email: 'admin@parking.com',
    password: hashedPassword,
    role: 'admin'
  });
  await admin.save();
  console.log('Admin created!');
  process.exit(0);
}

createAdmin();
```

Run it with: `node create-admin-temp.js` (then delete the file)

## Login as Admin

Once you've created an admin user:

1. Go to the Login page (`/login`)
2. Enter the admin email and password
3. Click "Login"
4. You should see "(Admin)" next to your name in the navbar

## Admin Features

Once logged in as admin, you can:

- ✅ **Add Parking Spots** - Click "+ Add Parking Spot" on the Parking Spots page
- ✅ **Delete Parking Spots** - Delete button appears on each parking spot card
- ✅ **Release Any Booking** - Can release any booked parking spot
- ✅ **Manage All Spots** - Full CRUD operations on parking spots

## Default Admin Credentials Example

If you create an admin user with these credentials:
- **Email:** `admin@parking.com`
- **Password:** `admin123`

**⚠️ Important:** 
- Change the default password in production!
- Admin accounts cannot be created through the browser signup form for security reasons
- Admin users must be created directly in the database

## Troubleshooting

### "Admin user already exists"
If you see this message, the admin user already exists. You can:
- Use the existing credentials to login
- Or update the existing user by running the script again (it will update the role)

### "Cannot connect to MongoDB"
Make sure:
- MongoDB is running
- The connection string in `.env` is correct (if using a script)
- You have proper MongoDB access permissions

