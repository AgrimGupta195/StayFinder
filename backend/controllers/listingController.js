import cloudinary from "../lib/cloudinary.js";
import Booking from "../models/bookingModel.js";
import Listing from "../models/listingModel.js";

export const createListing = async (req, res) => {
  try {
    const {
      title,
      description,
      pricePerNight,
      images,
      availableDates,
      location,
      amenities,
      maxGuests,
      numBedrooms,
      numBathrooms,
      propertyType
    } = req.body;
    const host = req.user._id;
    if (!images || images.length === 0) {
      return res.status(400).json({ message: "Images are required" });
    }
    let imagesArray = [];
    for (let i = 0; i < images.length; i++) {
      const uploadResponse = await cloudinary.uploader.upload(images[i]);
      imagesArray.push(uploadResponse.secure_url);
    }
    if (
      !title ||
      !description ||
      !pricePerNight ||
      !availableDates ||
      !location ||
      !host ||
      !maxGuests ||
      !numBedrooms ||
      !numBathrooms ||
      !propertyType
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (pricePerNight <= 0) {
      return res.status(400).json({ message: "Price per night must be greater than 0" });
    }
    const listing = new Listing({
      title,
      description,
      pricePerNight,
      images: imagesArray,
      availableDates,
      location,
      host,
      maxGuests,
      numBedrooms,
      numBathrooms,
      propertyType,
      amenities: amenities || []
    });
    await listing.save();
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const allListings = async (req, res) => {
  try {
    const listings = await Listing.find();

    for (const listing of listings) {
      const latestBooking = await Booking.findOne({ listingId: listing._id }).sort({ checkOut: -1 });
      const now = new Date();
      if (latestBooking && latestBooking.checkOut < now && listing.occupied) {
        listing.occupied = false;
        await listing.save();
      }
    }
    res.status(200).json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const listing = async (req, res) => {
  try {
    const listingId = req.params.id;
    const listing = await Listing.findById(listingId);
    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const hostListings = async (req, res) => {
  try {
    const hostId = req.user._id;
    const listings = await Listing.find({ host: hostId });
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const updateListing = async (req, res) => {
  try {
    const listingId = req.params.id;
    const hostId = req.user._id;

    const existingListing = await Listing.findById(listingId);

    if (!existingListing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    if (existingListing.host.toString() !== hostId.toString()) {
      return res.status(403).json({ message: "Unauthorized: Not your listing" });
    }

    const {
      title,
      description,
      pricePerNight,
      images,
      availableDates,
      location,
      amenities,
      maxGuests,
      numBedrooms,
      numBathrooms,
      propertyType
    } = req.body;
    if (title) existingListing.title = title;
    if (description) existingListing.description = description;
    if (pricePerNight) {
      if (pricePerNight <= 0) {
        return res.status(400).json({ message: "Price must be greater than 0" });
      }
      existingListing.pricePerNight = pricePerNight;
    }
    if (location) existingListing.location = location;
    if (availableDates) existingListing.availableDates = availableDates;
    if (amenities) existingListing.amenities = amenities;
    if (maxGuests) existingListing.maxGuests = maxGuests;
    if (numBedrooms) existingListing.numBedrooms = numBedrooms;
    if (numBathrooms) existingListing.numBathrooms = numBathrooms;
    if (propertyType) existingListing.propertyType = propertyType;
    // Handle image uploads
    if (images && images.length > 0) {
      let imagesArray = [];
      for (let i = 0; i < images.length; i++) {
        const uploadResponse = await cloudinary.uploader.upload(images[i]);
        imagesArray.push(uploadResponse.secure_url);
      }
      existingListing.images = imagesArray;
    }

    await existingListing.save();
    res.status(200).json(existingListing);
  } catch (error) {
    console.error("Error updating listing:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    const images = listing.images;
    for (let i = 0; i < images.length; i++) {
      const publicId = images[i].split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }
    await Listing.findByIdAndDelete(id);
    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};