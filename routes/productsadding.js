import cors from "cors";
import express from "express";
import auth from "../middleware/authmiddle.js";
import EMcreateEventValidation from "../validators/products.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import {
  AddingProduct,
  getAllProducts,
  getProduct,
  getMostRatingProducts,
  bodygetallproducts,
} from "../controllers/products.js";

const app = express();
app.use(express());
app.use(cors());

const router = express.Router();

router.post("/addproduct", async (req, res) => {
  let { error: missingFieldsError } =
    EMcreateEventValidation.requiredFieldsValidation(req.body);

  if (missingFieldsError) {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: ReasonPhrases.BAD_REQUEST,
      message: "Missing required fields in the body while adding the products",
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
});

router.get("/getproducts", auth,getAllProducts);

router.get("/getproduct/:id", auth,getProduct);

router.get("/bodygetproducts", auth, bodygetallproducts);

router.get("/getmostratingproducts", auth,getMostRatingProducts);

export default router;
