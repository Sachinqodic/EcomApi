import joi from "joi";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

const userRegisterValidation = joi.object({
  username: joi.string().alphanum().min(3).max(15).required().trim(),
  email: joi.string().email().required().trim(),
  age: joi.number().required(),
  Phone: joi.number().required(),
  Address: joi.string().required(),
  password: joi
    .string()
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z\\d\\W_]{8,30}$")
    )
    .required()
    .trim(),
  role: joi.string().required(),
});

userRegisterValidation.requiredFieldsValidation = (data) => {
  const requiredFields = [
    "username",
    "email",
    "age",
    "Phone",
    "Address",
    "password",
    "role",
  ];
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

export default async (req, res, next) => {
  let { error: missingFieldsError } =
    userRegisterValidation.requiredFieldsValidation(req.body);

  if (missingFieldsError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: ReasonPhrases.BAD_REQUEST,
      message: "Missing required fields in the body for registartion",
    });
  }

  // Fix: all the validations should be handled in registrationValidator, a single validator should handle validations for one route
  let { error: validationError } = userRegisterValidation.validate(req.body);

  if (validationError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: ReasonPhrases.BAD_REQUEST,
      message: "Invalid fields in the body for registartion",
    });
  }

  next();
};
