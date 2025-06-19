import express from 'express';
import {
  createListing,
  allListings,
  listing,
  updateListing,
  deleteListing,
  hostListings
} from '../controllers/listingController.js';
import { hostOnly, protectRoute } from '../middlewares/protectedRoute.js';

const router = express.Router();

router.post('/', protectRoute, hostOnly, createListing);
router.get('/hostProperties', protectRoute, hostOnly, hostListings);
router.get('/', allListings);
router.get('/:id', listing);
router.put('/:id', protectRoute, hostOnly, updateListing);
router.delete('/:id', protectRoute, hostOnly, deleteListing);

export default router;