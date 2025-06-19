import Booking from "../models/bookingModel.js";
import Listing from "../models/listingModel.js";

// Uncomment and use this only if you want to allow manual booking creation (not recommended for paid bookings)
// export const createBooking = async (req, res) => { ... }

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("Fetching bookings for user:", userId);

    const bookings = await Booking.find({ user: userId }).populate('listing');
    res.status(200).json(bookings); // Always return array, even if empty
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getHostBookings = async (req, res) => {
  try {
    const hostId = req.user._id;
    // Populate listing and filter in JS because you can't query nested fields in referenced docs
    const bookings = await Booking.find().populate('listing');
    const hostBookings = bookings.filter(
      (booking) => booking.listing && booking.listing.host && booking.listing.host.toString() === hostId.toString()
    );
    res.status(200).json(hostBookings);
  } catch (error) {
    console.error("Error fetching host bookings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const cancelBooking = async (req, res) => {
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