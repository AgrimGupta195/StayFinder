const  cloudinary  = require("../lib/cloudinary");
const Listing = require("../models/listingModel");
const createListing = async (req, res) => {
    try {
        const{ title, description, pricePerNight, images,availableDates,location } = req.body;
        const host = req.user._id;
        if(!images || images.length === 0){
            return res.status(400).json({message:"Images are required"});
        }
         let imagesArray=[];
         for(let i=0;i<images.length;i++){
            const uploadResponse = await cloudinary.uploader.upload(images[i]);
            imagesArray.push(uploadResponse.secure_url);
         }
        if(!title || !description || !pricePerNight || !availableDates || !location){
            return res.status(400).json({message:"All fields are required"});
        }
        if(pricePerNight <= 0){
            return res.status(400).json({message:"Price per night must be greater than 0"});
        }
         const listing = new Listing({
            title,
            description,
            pricePerNight,
            images: imagesArray,
            availableDates,
            location,
            host,
        });
        await listing.save();
        res.status(201).json(listing);
    } catch (error) {
        res.status(500).json({message:"Internal Server error"}) 
    }
}

const allListings = async (req, res) => {
    try {
        const listings = await Listing.find();
        res.status(200).json(listings);
    } catch (error) {
        res.status(500).json({message:"Internal Server error"});
    }
}
const listing = async (req, res) => {
    try {
        const listingId = req.params.id;
        const listing = await Listing.findById(listingId);
        res.status(200).json(listing);
    } catch (error) {
        res.status(500).json({message:"Internal Server error"});
    }
}
const cloudinary = require("../lib/cloudinary");
const Listing = require("../models/listingModel");

const updateListing = async (req, res) => {
  try {
    const listingId = req.params.id;
    const hostId = req.user._id;

    const existingListing = await Listing.findById(listingId);

    if (!existingListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Check if the current user is the host of this listing
    if (existingListing.host.toString() !== hostId.toString()) {
      return res.status(403).json({ message: "Unauthorized: Not your listing" });
    }

    const {
      title,
      description,
      pricePerNight,
      images, // base64 or url array
      availableDates,
      location,
    } = req.body;

    // Optional: Only update if values are provided
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


module.exports = {
    createListing,
    allListings,
    listing
};