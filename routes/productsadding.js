import express from "express";
import auth from "../middleware/authmiddle.js";
import productValidation from "../validators/products.js";
import {
  AddingProduct,
  //getAllProducts,
  getProduct,
  getMostRatingProducts,
  bodygetallproducts,
} from "../controllers/products.js";

const router = express.Router();

router.post("/addproduct", productValidation, auth, AddingProduct);

//router.get("/getproducts", auth, getAllProducts);

router.get("/getproduct/:id", auth, getProduct);

router.get("/bodygetproducts", auth, bodygetallproducts);

router.get("/getmostratingproducts", auth, getMostRatingProducts);

export default router;
