import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profilePhoto: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Generate unique 5-digit userId before validation
userSchema.pre('validate', async function (next) {
  if (this.isNew && !this.userId) {
    let isUnique = false;
    let newUserId;

    while (!isUnique) {
      // Generate random 5-digit number (10000-99999)
      newUserId = Math.floor(10000 + Math.random() * 90000).toString();

      // Check if this userId already exists
      const existingUser = await mongoose.model('User').findOne({ userId: newUserId });
      if (!existingUser) {
        isUnique = true;
      }
    }

    this.userId = newUserId;
  }
  next();
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;




