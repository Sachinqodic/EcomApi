import "../instrument.js";
import * as Sentry from "@sentry/node";
import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import Logs from "../models/LoginLogoutDetails.js";
import { StatusCodes } from "http-status-codes";

const app = express();
app.use(express.json());
app.use(cors());

export default async (req, res, next) => {
  let authHeader = req.headers["authorization"];
  let token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    // Verify the JWT token
    let decoded = jwt.verify(token, process.env.SEC);
    let userId = decoded.id;

    // Check if the user has an active session in the Logs model
    const userLogs = await Logs.findOne({ UserId: userId });

    // If no logs are found or if the UserToken is null, it means the user is logged out
    if (!userLogs || userLogs.UserToken === null) {
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ error: "User is logged out" });
    }
    req.user = decoded;
    next() // to pass the contolle to the next middleware are controller logic
  } catch (err) {

    console.log("server error in the middleware:",err)
    Sentry.captureException(err);

    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Invalid token" });
  }
};
