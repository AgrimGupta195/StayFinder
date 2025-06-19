const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./lib/db');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const path = require('path');


app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


const PORT = process.env.PORT || 5000;
app.use("/api/users", require('./routers/userRouter'));
app.use("/api/listings", require('./routers/listingRouter'));
app.use("/api/bookings", require('./routers/bookingRouter'));
app.use("/api/payments", require('./routers/paymentRouter'));
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});