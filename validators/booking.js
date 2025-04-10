import express from "express";
import joi from "joi";

// Fix: Why is the app re-inititated here, it is already done in the app.js file? What is the usecase?
const app = express();
app.use(express.json());

const userNoOfSeatsValidation = joi.object({
  NoOfItems: joi.number().min(1).required().strict(),

});

export const UeventbookValidation = {
  userNoOfSeatsValidation,
};
