import "../instrument.js";
import * as Sentry from "@sentry/node";
import cors from "cors";
import express from "express";
import { StatusCodes } from "http-status-codes";

const app = express();
app.use(express.json());
app.use(cors());

export default async (req, res, next) => {
  try {
    let UserRole = req.user.role;

    console.log(UserRole);

    if (UserRole !== "admin") {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Accees denied,You are not an admin" });
    }
    next();
  } catch (err) {
    console.log("server error while checking admin role:", err);
    Sentry.captureException(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "server error while checking admin role" });
  }
};
