const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./lib/db');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || true, credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

// API Routes
app.use("/api/users", require('./routers/userRouter'));
app.use("/api/listings", require('./routers/listingRouter'));
app.use("/api/bookings", require('./routers/bookingRouter'));
app.use("/api/payments", require('./routers/paymentRouter'));

// Serve frontend (if deploying both together)
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});