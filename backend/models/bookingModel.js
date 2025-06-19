import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  checkIn: {
    type: Date,
    required: true
},
  checkOut: {
    type: Date, 
    required: true 
},
  totalPrice: { 
    type: Number, 
    required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  },
  sessionId: {
    type: String,
    required: true,
  },
},{
    timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
