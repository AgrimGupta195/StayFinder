const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./lib/db');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
app.use(cors());
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 5000;
app.use("/api/users", require('./routers/userRouter'));
app.use("/api/listings", require('./routers/listingRouter'));
app.use("/api/bookings", require('./routers/bookingRouter'));
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});