import express from "express";
import cors from "cors";

import {
  AddingProduct,
  getAllProducts,
  getProduct,
  getMostRatingProducts,
  bodygetallproducts,
} from "../controllers/products.js";

import auth from "../middleware/authmiddle.js";

import EMcreateEventValidation from "../validators/products.js";

import { ReasonPhrases, StatusCodes } from "http-status-codes";

const app = express();
app.use(express());
app.use(cors());

const router = express.Router();

router.post(
  "/addproduct",

  async (req, res) => {
    let { error: missingFieldsError } =
      EMcreateEventValidation.requiredFieldsValidation(req.body);

    if (missingFieldsError) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: ReasonPhrases.BAD_REQUEST,
        message:
          "Missing required fields in the body while adding the products",
      });
    }

    let { error: validateError } = EMcreateEventValidation.validate(req.body);

    if (validateError) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: ReasonPhrases.BAD_REQUEST,
        message: "Invalid fields in the body while adding the products",
      });
    }

    await auth(req, res);

    await AddingProduct(req, res);
  }
);

router.get("/getproducts", async (req, res) => {
  console.log("inside the products");

  await auth(req, res);
  console.log("passed the middleaware");
  await getAllProducts(req, res);
});

router.get("/getproduct/:id", async (req, res) => {
  await auth(req, res);
  await getProduct(req, res);
});

// through the body
router.get("/bodygetproducts", async (req, res) => {
  await auth(req, res);
  await bodygetallproducts(req, res);
});

router.get("/getmostratingproducts", async (req, res) => {
  await auth(req, res);
  await getMostRatingProducts(req, res);
});

export default router;
