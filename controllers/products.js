import "../instrument.js";
import * as Sentry from "@sentry/node";
import cors from "cors";
import express from "express";
import Orders from "../models/Orders.js";
import Products from "../models/Products.js";
import { StatusCodes } from "http-status-codes";
import UsersDetails from "../models/UsersDetails.js";

const app = express();
app.use(express.json());
app.use(cors());

console.log("Starting authopera.js...");

export const AddingProduct = async (req, res) => {
  let user = await UsersDetails.findById(req.user.id);
  console.log("user info who adding the product:", user);

  let {
    productName,
    productDescription,
    price,
    quantityAvailable,
    category,
    Bookedproducts,
    manufactureredBy,
    Ratings,
  } = req.body;

  try {
    let product = new Products({
      productName,
      productDescription,
      price,
      category,
      quantityAvailable,
      Bookedproducts,
      manufactureredBy,
      Ratings,
    });

    await product.save();

    res
      .status(StatusCodes.CREATED)
      .json({ message: "The product added successfully" });

  } catch (err) {

    console.error("Error adding the product:", err);
    Sentry.captureException(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "server Error while adding the products" });
  }
};

// using the params
export const getAllProducts = async (req, res) => {
  let ls = req.query;

  let obj = {};

  let k1 = Object.keys(ls);

  let v1 = Object.values(ls);

  for (let i = 0; i < k1.length; i++) {
    obj[k1[i]] = v1[i];
  }

  console.log(obj);

  // remove later
  // for (let j in ls) {
  //   console.log(j); // getting key
  //   console.log(ls[j]); // getting value
  // }
  // console.log(ls);
  // let p = { ls };

  try {
    let products = await Products.find(obj);

    console.log("The products are:", products);
    res.status(StatusCodes.OK).json({ products });

  } catch (err) {

    console.log("error while getting all  the products:",err);
    Sentry.captureException(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "server error while getting the products" });
  }
};

// using the body
export const bodygetallproducts = async (req, res) => {
  let { filter, search } = req.body;

  let { page, limit } = req.query;
  // used for skip from starting
  const offset = (page - 1) * limit;

  console.log(filter,search)

  try {
    // creating the object to be used in the query.
    let obj = {};

    if (search != "" && filter == undefined) {
      obj = {
        $or: [
          { productName: { $regex: `${search}`, $options: "i" } },
          { category: { $regex: `${search}`, $options: "i" } },
        ],
      };
      console.log(obj);
    }

    if (filter && search == undefined) {
      obj = Object.assign(obj, filter);
    } else if (search && filter) {
      obj = {
        $or: [
          { productName: { $regex: `${search}`, $options: "i" } },
          { category: { $regex: `${search}`, $options: "i" } },
        ],
      };
      obj = Object.assign(obj, filter);
    }

    //  query to get the products.
    let data1 = await Products.aggregate([
      { $match: obj },

      {
        $lookup: {
          from: "orders",
          let: { product_id: { $toString: "$_id" } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$$product_id", "$ProductsIdList"],
                },
              },
            },
          ],
          as: "results",
        },
      },

      {
        $addFields: {
          results_length: { $size: "$results" },
        },
      },

      {
        $addFields: {
          topOrder: {
            $cond: {
              if: { $gte: ["$results_length", 4] },
              then: true,
              else: false,
            },
          },
        },
      },

      { $project: { results: 0 } },
    ])
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    if (!data1.length) {
      return res.status(StatusCodes.OK).json("no products find ");
    }
    console.log("The products are:", data1);

    let Response = {
      "Total products found:": data1.length,
      Results: data1,
    };
    return res.status(StatusCodes.OK).json(Response);

  } catch (err) {

    console.log("error while getting all  the products:", err);
    Sentry.captureException(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "server error while getting the products" });
  }
};

export const getProduct = async (req, res) => {
  try {
    let id = req.params.id;
    let product = await Products.findById(id);
    res.status(StatusCodes.OK).json(product);
  } catch (err) {

    console.log("server error while gettings the proucts  BY ID:",err);
    Sentry.captureException(err);

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "server error while gettings the products by id" });
  }
};

export const getMostRatingProducts = async (req, res) => {
  try {
    let pro = await Products.find({ Ratings: { $gt: 3.9 } });

    res.status(StatusCodes.OK).json(pro);

  } catch (err) {

    console.log("server error while getting the most rating products",err);
    Sentry.captureException(err);

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "server error while getting the most rating products" });
  }
};
