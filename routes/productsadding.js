import express from "express";
import cors from "cors";


import {
  AddingProduct,
  getAllProducts,
  getProduct,
  getMostRatingProducts

  
  
} from "../controllers/products.js";




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



    await AddingProduct(req, res);
  }
);

router.get("/getallproducts", async (req, res) => {
  await getAllProducts(req, res);
});

router.get("/getproduct/:id", async (req, res) => {
  await getProduct(req, res);
});


router.get("/getmostratingproducts",async(req,res)=>{
  await getMostRatingProducts(req,res);
});


export default router;
