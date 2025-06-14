const express = require('express');
const router = express.Router();

const { createListing, allListings, listing, updateListing, deleteListing } = require('../controllers/listingController');
const { hostOnly,protectRoute } = require('../middlewares/protectedRoute');

router.post('/', protectRoute, hostOnly, createListing);
router.get('/', allListings);
router.get('/:id', listing);
router.put('/:id', protectRoute, hostOnly, updateListing);
router.delete('/:id', protectRoute, hostOnly, deleteListing);

module.exports = router;