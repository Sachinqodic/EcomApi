import joi from "joi";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

const userLoginvalidation = joi.object({
  username: joi.string().alphanum().min(3).max(15).required().trim(),
  password: joi
    .string()
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z\\d\\W_]{8,30}$")
    )
    .required()
    .trim(),
});

userLoginvalidation.requiredFieldsValidation = (data) => {
  const requiredFields = ["username", "password"];
  for (let field of requiredFields) {
    if (!data[field]) {
      return {
        error: {
          message: "Missing required fields in the body",
        },
      };
    }
  }
  return { error: null };
};

export default (req, res, next) => {
  let { error: missingFieldsError } =
    userLoginvalidation.requiredFieldsValidation(req.body);

  if (missingFieldsError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: ReasonPhrases.BAD_REQUEST,
      message: "Missing required fields in the body for login",
    });
  }

  let { error: validationError } = userLoginvalidation.validate(req.body);

  if (validationError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: ReasonPhrases.BAD_REQUEST,
      message: "Invalid fields in the body for login",
    });
  }

  next();
};
