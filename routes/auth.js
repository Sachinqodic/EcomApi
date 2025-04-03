import express from "express";

import userRegisterValidation from "../validators/register.js";
import userLoginvalidation from "../validators/login.js";
import userLogoutValidation from "../validators/logout.js";

import auth from "../middleware/authmiddle.js";




import {
  register,
  login,
  logout,
  allusers

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


router.post("/login", async (req, res) => {
  let { error: missingFieldsError } =
    userLoginvalidation.requiredFieldsValidation(req.body);

  if (missingFieldsError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: ReasonPhrases.BAD_REQUEST,
      message: routesmessages.authroutes.loginmessagesA,
    });
  }

  let { error: validationError } = userLoginvalidation.validate(req.body);

  if (validationError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: ReasonPhrases.BAD_REQUEST,
      message: routesmessages.authroutes.loginmessagesB,
    });
  }

  await login(req, res);
})



router.post("/logout",async(req,res)=>{
  console.log(
    req.headers["authorization"],
    "this is the request header for me "
  );
  console.log(req.headers);

  let { error } = userLogoutValidation.validate({
    authorization: req.headers["authorization"],
  });

  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: ReasonPhrases.BAD_REQUEST,
      message: routesmessages.authroutes.logoutmessagesA,
    });
  }

  await auth(req, res);



  await logout(req,res);
})

router.get("/allusers",async(req,res)=>{

  await allusers(req,res);
})



export default router;
