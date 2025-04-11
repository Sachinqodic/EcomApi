import joi from "joi";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

const userLogoutValidation = joi.object({
  authorization: joi
    .string()
    .pattern(
      /^Bearer [A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/,
      "JWT Token"
    )
    .required()
    .trim(),
});

export const logoutValidator = (req, res, next) => {
  let { error } = userLogoutValidation.validate({
    authorization: req.headers["authorization"],
  });

  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: ReasonPhrases.BAD_REQUEST,
      message: "Invalid token missing in the header or invalid token while logout",
    });
  }

  next();
};
