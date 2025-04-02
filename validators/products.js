import express from "express";
import joi from "joi";

const app = express();
app.use(express.json());

const EMcreateEventValidation = joi.object({

    productName: joi.string().required().trim(),
  productDescription: joi.string().required().trim(),

  price: joi.number().min(1).required().strict(),

  quantityAvailable: joi.number().min(10).required().strict(),
  manufactureredBy: joi.string().required().trim(),

  Ratings: joi.number().required().strict(),


});

EMcreateEventValidation.requiredFieldsValidation = (data) => {
  const requiredFields = [
    "productName",
    "productDescription",
    "price",
    "quantityAvailable",
    "manufactureredBy",
    "Ratings"
  ];
  
  for (let field of requiredFields) {
    if (!(field in data)) {
      return {
        error: {
          message: "Missing required fields in the body@@@",
        },
      };
    }
  }
  return { error: null };
};

export default EMcreateEventValidation;
