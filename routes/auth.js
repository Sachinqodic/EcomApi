import express from "express";
import auth from "../middleware/authmiddle.js";
import { roleAuthentication } from "../constants/enums.js";
import userLoginvalidation from "../validators/login.js";
import userLogoutValidation from "../validators/logout.js";
import userRegisterValidation from "../validators/register.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import {
  register,
  login,
  logout,
  allusers,
} from "../controllers/usersRegister.js";

const app = express();

app.use(express.json());

const router = express.Router();

router.post("/register", (req, res) => {
  let { error: missingFieldsError } =
    userRegisterValidation.requiredFieldsValidation(req.body);

  if (missingFieldsError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: ReasonPhrases.BAD_REQUEST,
      message: "Missing required fields in the body for registartion",
    });
  }

  let { error: validationError } = userRegisterValidation.validate(req.body);

  if (validationError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: ReasonPhrases.BAD_REQUEST,
      message: "Invalid fields in the body for registartion",
    });
  }

  roleAuthentication, register(req, res);
});

router.post("/login", async (req, res) => {
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

  await login(req, res);
});

router.post("/logout", async (req, res) => {
  let { error } = userLogoutValidation.validate({
    authorization: req.headers["authorization"],
  });

  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: ReasonPhrases.BAD_REQUEST,
      message: "Invalid fields in the body for logout",
    });
  }

  await auth(req, res);

  await logout(req, res);
});

router.get("/allusers", allusers);

export default router;
