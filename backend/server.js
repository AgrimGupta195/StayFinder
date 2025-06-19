import express from 'express';
import cors from 'cors';
import connectDB from './lib/db.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import userRouter from './routers/userRouter.js';
import listingRouter from './routers/listingRouter.js';
import bookingRouter from './routers/bookingRouter.js';
import paymentRouter from './routers/paymentRouter.js';

// For __dirname in ES modules


// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();
const __dirname = path.resolve();
const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || true, credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

// API Routes
app.use("/api/users", userRouter);
app.use("/api/listings", listingRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/payments", paymentRouter);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});