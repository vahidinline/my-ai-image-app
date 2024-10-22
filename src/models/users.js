import mongoose from 'mongoose';
import credits from './credits';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  credits: {
    type: Number,
    default: 100,
  },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
