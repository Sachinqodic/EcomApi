import express from "express";
import joi from "joi";

const app = express();
app.use(express.json());



const userNoOfSeatsValidation = joi.object({
  NoOfItems: joi.number().min(1).required().strict(),
 // id: joi.string().required()
});

export const UeventbookValidation = {
  userNoOfSeatsValidation,
};

