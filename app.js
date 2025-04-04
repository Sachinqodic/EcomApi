import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRou from "./routes/auth.js";
import eventRou from "./routes/productsadding.js";
import Booking from "./routes/orders.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
// import dbConnect from './utils/db.js';

console.log("hello");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
console.log("Mongo URI", process.env.MONGO_URL);

// Database connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 5000,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    Sentry.captureException(err);
  });

// Routes
app.use("/auth", authRou);
app.use("/product", eventRou);
app.use("/booking", Booking);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ error: "Internal Server Error" });
});

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export default app;
