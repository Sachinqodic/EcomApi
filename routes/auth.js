import express from "express";
import auth from "../middleware/authmiddle.js";
import { roleAuthentication } from "../middleware/registerrole.js";
import { registerValidator } from "../validators/register.js";
import { loginValidator } from "../validators/login.js";
import { logoutValidator } from "../validators/logout.js";
import Role from "../middleware/adminRole.js";

import {
  register,
  login,
  logout,
  allusers,
} from "../controllers/usersRegister.js";

const router = express.Router();

router.post("/register", registerValidator, roleAuthentication, register);

router.post("/login", loginValidator, login);

router.post("/logout", logoutValidator, auth, logout);

router.get("/allusers", auth, Role, allusers); //Admin route

export default router;
