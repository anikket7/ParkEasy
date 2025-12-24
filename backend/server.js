
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
// import session from 'express-session';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import parkingRoutes from './routes/parking.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(session({
//   secret: process.env.SESSION_SECRET || 'your-secret-key',
//   resave: false,
//   saveUninitialized: false,
//   cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
// }));

// MongoDB Connection
mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/parkeasy'
)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/parking', parkingRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'ParkEasy API' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

