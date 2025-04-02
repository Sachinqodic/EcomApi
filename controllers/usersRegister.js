
import express from "express";
import cors from "cors";



import UsersDetails from "../models/UsersDetails.js";



import {
  StatusCodes
} from "http-status-codes";

const app = express();

// Middleware to parse JSON
app.use(express.json());

app.use(cors());

console.log("Starting authopera.js...");



export const register = async (req, res) => {
  console.log("iam inside the register controller");

  let { username, age, email, Phone,Address} = req.body;

  

  try {
   
                
    let user = new UsersDetails({ username, age, email, Phone,Address});

    await user.save();

    console.log("The endUser registered,with the  details:", user);

    res
      .status(StatusCodes.CREATED)
      .json({ message: "The endUser registered successfully" });
  } catch (err) {
    console.error("Error creating user:", err);
   

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "server Error creating user" });
  }
};