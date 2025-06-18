const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  pricePerNight: { type: Number, required: true },
  location: { 
    State: { type: String, required: true },
    City: { type: String, required: true },
    Address: { type: String, required: true },
    ZipCode: { type: String, required: true },
    Country: { type: String, required: true },
    StreetAddress: { type: String, required: true }
  },
  propertyType: {
    type: String,
    enum: ['Apartment', 'House', 'Condo', 'Villa', 'Cottage', 'Townhouse', 'Loft', 'Studio', 'Bungalow', 'Cabin'],
    required: true,
  },
  occupied:{
    type: Boolean,
    default: false,
  },
  images: [String],
  availableDates: [Date],
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amenities: {
    type: [String],
    default: [],
  },
  maxGuests: {
    type: Number,
    required: true,
  },
  numBedrooms: {
    type: Number,
    required: true,
  },
  numBathrooms: {
    type: Number,
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
