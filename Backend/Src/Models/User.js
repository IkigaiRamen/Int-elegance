const { Schema, model } = require('mongoose');
const mongoose = require("mongoose");

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, enum: ['Male', 'Female'], default: null },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Company', 'Team Lead', 'Employee'], default: null },
  address: { type: String, default: null },
  dateOfBirth: { type: Date, default: null },
  phoneNumber: { type: String, default: null },
  emergencyContact: { type: String, default: null },
  country: { type: String, default: null },
  bannerPicture: { type: String, default: null }, 
  profilePicture: { type: String, default: null },
  techRole: { type: String, default: null },
  bio: { type: String, default: null },
  maritalStatus: { type: String, default: null }, 
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String, required: false },
  isGoogleUser: { type: Boolean, default: false }, // Flag for Google-authenticated users
  invitations: [
    {
      companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
      companyName: String,
      status: { type: String, default: "pending" },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  // Directly embedding notifications within the User schema
  notifications: [
    {
      message: { type: String, required: true },
      type: { 
        type: String, 
        enum: ['info', 'warning', 'error', 'success'], // Notification types
        default: 'info' 
      },
      status: { type: Boolean, default: false }, // false = unread, true = read
      createdAt: { type: Date, default: Date.now }, // Timestamp of when notification was created
      updatedAt: { type: Date, default: Date.now }, // Timestamp of when notification was last updated
    }
  ]
});

module.exports = model('User', UserSchema);
