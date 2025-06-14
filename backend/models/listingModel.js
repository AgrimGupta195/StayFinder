const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  pricePerNight: { type: Number, required: true },
  location: { type: String, required: true },
  images: [String],
  availableDates: [Date],
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
},{
    timestamps: true,
});

module.exports = mongoose.model('Listing', listingSchema);
