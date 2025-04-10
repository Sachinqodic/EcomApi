import cors from "cors";
import express from "express";
import auth from "../middleware/authmiddle.js";
import Role from "../middleware/adminRole.js";
import {
  payment,
  Adminchanges,
  getallPaidOrders,
  userConfirmation,
} from "../controllers/payment.js";

// Fix: Why is the app re-inititated here, it is already done in the app.js file? What is the usecase?
const app = express();
app.use(express());
app.use(cors());

const router = express.Router();

router.post("/pay/:id", auth, payment);

router.get("/getallPaidOrders", auth, Role, getallPaidOrders); // PAGINATION

router.post("/tomaketransit/:id", auth, Role, Adminchanges);

router.post("/deliver/:id", auth, userConfirmation);

export default router;
