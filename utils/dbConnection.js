import "../instrument.js";
import * as Sentry from "@sentry/node";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

console.log("Mongo URI", process.env.MONGO_URL);

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 5000,
    });
    console.log("Database connection established successfully");
  } catch (err) {
    console.error("Database connection failed:", err);
    Sentry.captureException(err);
  }
};
