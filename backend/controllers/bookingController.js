const Booking = require("../models/bookingModel");
const Listing = require("../models/listingModel");

const createBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const { listingId, checkIn, checkOut, totalPrice } = req.body;

    if (!listingId || !checkIn || !checkOut || !totalPrice) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ message: "Check-out must be after check-in" });
    }
    listing.occupied = true;
    await listing.save();
    const booking = new Booking({
      user: userId,
      listing: listingId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalPrice,
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookings = await Booking.find({ user: userId }).populate('listing');

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this user" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const getHostBookings = async (req, res) => {
  try {
    const hostId = req.user._id;
    const bookings = await Booking.find({ 'listing.host': hostId }).populate('listing');

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this host" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching host bookings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    await Booking.findByIdAndDelete(bookingId);
    res.status(200).json({ message: "Booking canceled successfully" });
  } catch (error) {
    console.error("Error canceling booking:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



module.exports = { createBooking , 
                   getUserBookings, 
                   getHostBookings, 
                   cancelBooking 
                };
