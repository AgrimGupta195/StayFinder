import express from 'express';
import { getUserBookings, getHostBookings, cancelBooking } from '../controllers/bookingController.js';
import { protectRoute } from '../middlewares/protectedRoute.js';

const router = express.Router();

// router.post('/', protectRoute, createBooking);
router.get('/me', protectRoute, getUserBookings);
router.get('/host', protectRoute, getHostBookings);
router.delete('/:id', protectRoute, cancelBooking);

export default router;
