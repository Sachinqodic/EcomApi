import express from "express";

import userRegisterValidation from "../validators/register.js";




import {
  register
} from "../controllers/usersRegister.js";

import {
  ReasonPhrases,
  StatusCodes
} from "http-status-codes";

const app = express();

// Middleware to parse JSON
app.use(express.json());

const router = express.Router();

router.post("/register", async (req, res) => {
  let { error: missingFieldsError } =
    userRegisterValidation.requiredFieldsValidation(req.body);

  if (missingFieldsError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: ReasonPhrases.BAD_REQUEST,
      message: "Missing required fields in the body for registartion", 
    });
  }

  let { error: validationError } = userRegisterValidation.validate(req.body);
  console.log("iam in the validation error");

  if (validationError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: ReasonPhrases.BAD_REQUEST,
      message: "Invalid fields in the body for registartion",
    });
  }

 

  console.log("before going to the controller registartion");
  await register(req, res);
});




export default router;
