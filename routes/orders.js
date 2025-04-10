import cors from "cors";
import express from "express";
import auth from "../middleware/authmiddle.js";
import bookingValidation from "../validators/booking.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import {
  myorders,
  booking,
  multipleProductsbooking,
  getallorders,
  orderDetails,
  cancelorder,
  updatingbooking,
} from "../controllers/bookings.js";

const app = express();
app.use(express());
app.use(cors());

const router = express.Router();

router.post("/book/:id", bookingValidation, auth, booking);

router.post("/multipleProductsbooking", auth, multipleProductsbooking);

router.get("/allorders", auth, getallorders);

router.get("/oderdetails", auth, orderDetails);

router.get("/myorders/:id", auth, myorders);

router.put("/updateorder/:id", auth, updatingbooking);

router.delete("/calcelorder/:id", auth, cancelorder);

export default router;
