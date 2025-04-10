import express from "express";
import auth from "../middleware/authmiddle.js";
import { roleAuthentication } from "../middleware/registerrole.js";
import registervalidation from "../validators/register.js";
import loginValidation from "../validators/login.js";
import logoutValidation from "../validators/logout.js";
import Role from "../middleware/adminRole.js";

import {
  register,
  login,
  logout,
  allusers,
} from "../controllers/usersRegister.js";

const router = express.Router();

router.post("/register", registervalidation, roleAuthentication, register);

router.post("/login", loginValidation, login);

router.post("/logout", logoutValidation, auth, logout);

router.get("/allusers", Role, allusers); //Admin route

export default router;
