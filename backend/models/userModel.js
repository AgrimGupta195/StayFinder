const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },

  role: {
    type: String,
    enum: ['user', 'host', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
},{
    timestamps: true,
});


module.exports = mongoose.model('User', userSchema);
