import express from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

const app = express();
app.use(express.json());

export const roleAuthentication = (req, res, next) => {
  let { role } = req.body;
  console.log("Role give when registering is :", role);
  let enums = ["user", "admin"];
  if (!enums.includes(role)) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: ReasonPhrases.BAD_REQUEST,
      message: "Role should be user or admin",
    });
  }

  next();
  console.log("role outs side");
};
