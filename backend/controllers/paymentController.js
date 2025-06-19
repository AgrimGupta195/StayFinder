import Listing from "../models/listingModel.js";
import Booking from "../models/bookingModel.js";
import { stripe } from "../lib/stripe.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { listingId, checkIn, checkOut, guests } = req.body;

    if (!listingId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({ error: "Missing required booking details." });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found." });
    }

    // Calculate nights
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    if (nights <= 0) {
      return res.status(400).json({ error: "Invalid check-in/check-out dates." });
    }

    const totalAmount = listing.pricePerNight * nights * guests;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: listing.title,
              images: listing.images ? [listing.images[0]] : [],
              description: listing.description,
            },
            unit_amount: Math.round(listing.pricePerNight * 100),
          },
          quantity: nights * guests,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/booking-cancel`,
      metadata: {
        userId: req.user._id.toString(),
        listingId,
        checkIn,
        checkOut,
        guests: guests.toString(),
        nights: nights.toString(),
      },
    });

    res.status(200).json({ id: session.id, totalAmount });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ message: "Error creating Stripe session", error: error.message });
  }
};

export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    console.log("Processing successful checkout for session ID:", sessionId);

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const { userId, listingId, checkIn, checkOut, guests, nights } = session.metadata;

      const newBooking = new Booking({
        user: userId,
        listing: listingId,
        checkIn,
        checkOut,
        guests: Number(guests),
        totalNights: Number(nights),
        totalPrice: session.amount_total / 100,
        sessionId: sessionId, // <-- use sessionId, not stripeSessionId
        status: "confirmed",
      });

      await newBooking.save();

      res.status(200).json({
        success: true,
        message: "Payment successful and booking created.",
        bookingId: newBooking._id,
      });
    } else {
      res.status(400).json({ message: "Payment not completed." });
    }
  } catch (error) {
    console.error("Error processing successful checkout:", error);
    res.status(500).json({ message: "Error processing successful checkout", error: error.message });
  }
};