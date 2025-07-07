import joi from "joi";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

const userLoginvalidation = joi.object({
  username: joi.string().alphanum().min(3).max(15).trim(),
  password: joi
    .string()
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z\\d\\W_]{8,30}$")
    )
    .trim(),
});

export const loginValidator = (req, res, next) => {
  try {
    // validation check for login
    let { error: validationError } = userLoginvalidation.validate(req.body);

    if (validationError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: ReasonPhrases.BAD_REQUEST,
        message: "Invalid fields in the body for login",
      });
    }

    // missing fields check for login
    const requiredFields = ["username", "password"];

    function demo(x) {
      console.log(x);
      if (!Object.keys(req.body).includes(x)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: ReasonPhrases.BAD_REQUEST,
          message: "Missing required fields in the body for login",
        });
      }
    }
    requiredFields.filter(demo);
    next();
  } catch (err) {
    console.log("server error while checking the login validation:", err);
    //Sentry.captureException(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "server error while checking the login validation" });
  }
};
