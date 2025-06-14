const express = require('express');
const { createBooking, getUserBookings, getHostBookings, cancelBooking } = require('../controllers/bookingController');
const { protectRoute } = require('../middlewares/protectedRoute');
const router = express.Router();

router.post('/',protectRoute,createBooking);
router.get('/me',protectRoute,getUserBookings);
router.get('/host',protectRoute,getHostBookings);
router.delete('/:id', protectRoute,cancelBooking);

module.exports = router;
