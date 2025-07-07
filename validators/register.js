import joi from "joi";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

const userRegisterValidation = joi.object({
  username: joi.string().alphanum().min(3).max(15).trim(),
  email: joi.string().email().trim(),
  age: joi.number(),
  Phone: joi.number(),
  Address: joi.string(),
  password: joi
    .string()
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z\\d\\W_]{8,30}$")
    )

    .trim(),
  role: joi.string(),
});

export const registerValidator = (req, res, next) => {
  try {
    
    // validation check for register
    let { error: validationError } = userRegisterValidation.validate(req.body);
    if (validationError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: ReasonPhrases.BAD_REQUEST,
        message: "Invalid fields in the body for registartion",
      });
    }

    // missing fields check for register
    const requiredFields = [
      "username",
      "email",
      "age",
      "Phone",
      "Address",
      "password",
      "role",
    ];

    function demo(x) {
      console.log(x);
      if (!Object.keys(req.body).includes(x)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: ReasonPhrases.BAD_REQUEST,
          message: "Missing required fields in the body for registartion @@",
        });
      }
    }
    requiredFields.filter(demo);
    next();
  } catch (err) {
    console.log("server error while checking the register validation:", err);
    //Sentry.captureException(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "server error while checking the register validation" });
  }
};
