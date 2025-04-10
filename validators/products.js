import joi from "joi";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

const productValidation = joi.object({
  productName: joi.string().required().trim(),
  productDescription: joi.string().required().trim(),

  price: joi.number().min(1).required().strict(),

  quantityAvailable: joi.number().min(10).required().strict(),
  manufactureredBy: joi.string().required().trim(),

  Ratings: joi.number().required().strict(),
  Bookedproducts: joi.number().required().strict(),
  category: joi.string().required().trim(),
});

productValidation.requiredFieldsValidation = (data) => {
  const requiredFields = [
    "productName",
    "productDescription",
    "price",
    "quantityAvailable",
    "manufactureredBy",
    "Ratings",
    "Bookedproducts",
    "category",
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

export default (req, res, next) => {
  let { error: missingFieldsError } =
    productValidation.requiredFieldsValidation(req.body);

  if (missingFieldsError) {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: ReasonPhrases.BAD_REQUEST,
      message: "Missing required fields in the body while adding the products",
    });
  }

  let { error: validateError } = productValidation.validate(req.body);

  if (validateError) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: ReasonPhrases.BAD_REQUEST,
      message: "Invalid fields in the body while adding the products",
    });
  }
  next();
};
