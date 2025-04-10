import joi from "joi";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

const userNoOfSeatsValidation = joi.object({
  NoOfItems: joi.number().min(1).required().strict(),
});

export default (req, res, next) => {
  let { error: NoSeatsError } = userNoOfSeatsValidation.validate(req.body);

  if (NoSeatsError) {
    return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
      error: ReasonPhrases.BAD_REQUEST,
      message: "validation error while booking the product",
    });
  }
  next();
};
