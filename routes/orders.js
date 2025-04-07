import cors from "cors";
import express from "express";
import auth from "../middleware/authmiddle.js";
import { UeventbookValidation } from "../validators/booking.js";
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

router.post("/book/:id", async (req, res) => {
  let { error: NoSeatsError } =
    UeventbookValidation.userNoOfSeatsValidation.validate(req.body);

  if (NoSeatsError) {
    return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
      error: ReasonPhrases.BAD_REQUEST,
      message: "validation error while booking the product",
    });
  }

  await auth(req, res);
  await booking(req, res);
});

router.post("/multipleProductsbooking", async (req, res) => {
  await auth(req, res), await multipleProductsbooking(req, res);
});

router.get("/allorders", async (req, res) => {
  await auth(req, res);
  await getallorders(req, res);
});

router.get("/oderdetails", async (req, res) => {
  await auth(req, res);
  await orderDetails(req, res);
});

router.get("/myorders/:id", async (req, res) => {
  await auth(req, res);
  await myorders(req, res);
});

router.put("/updateorder/:id", async (req, res) => {
  await auth(req, res);
  await updatingbooking(req, res);
});

router.delete("/calcelorder/:id", async (req, res) => {
  await auth(req, res);
  await cancelorder(req, res);
});

export default router;
