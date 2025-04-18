import "./instrument.js";
import * as Sentry from "@sentry/node";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import routes from "./routes/index.js";
import { StatusCodes } from "http-status-codes";
import { connectDB } from "./utils/dbConnection.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

console.log("Mongo URI", process.env.MONGO_URL);

//sentry set up
Sentry.setupExpressErrorHandler(app);

//db connection
connectDB();

app.use("/", routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ error: "Internal Server Error" });
});

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export default app;
