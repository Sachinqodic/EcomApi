import "../instrument.js";
import * as Sentry from "@sentry/node";
import mongoose from "mongoose";
import Orders from "../models/Orders.js";
import Products from "../models/Products.js";
import { StatusCodes } from "http-status-codes";
import UsersDetails from "../models/UsersDetails.js";






export const AddingProduct = async (req, res) => {

  // starting the session management nad transaction
  const session = await mongoose.startSession();
  session.startTransaction();

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
    let product = await Products.create({
      productName,
      productDescription,
      price,
      category,
      quantityAvailable,
      Bookedproducts,
      manufactureredBy,
      Ratings,
    });

    console.log(product);

    // await session.commitTransaction();
    // await session.endSession();


    req.session=session;

    return res
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
// export const getAllProducts = async (req, res) => {
//   let ls = req.query;

//   let obj = {};

//   let k1 = Object.keys(ls);

//   let v1 = Object.values(ls);

//   for (let i = 0; i < k1.length; i++) {
//     obj[k1[i]] = v1[i];
//   }

//   console.log(obj);

//   // remove later
//   // for (let j in ls) {
//   //   console.log(j); // getting key
//   //   console.log(ls[j]); // getting value
//   // }
//   // console.log(ls);
//   // let p = { ls };

//   try {
//     let products = await Products.find(obj);

//     console.log("The products are:", products);
//     res.status(StatusCodes.OK).json({ products });

//   } catch (err) {

//     console.log("error while getting all  the products:",err);
//     Sentry.captureException(err);
//     return res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ error: "server error while getting the products" });
//   }
// };

// using the body

// Fix: Needs to be more cleaner and readable, This controller requires formating
export const bodygetallproducts = async (req, res) => {
  const  { filter, search } = req.body;

  // pagination
  let { page, limit } = req.query;
  //used for skip from starting
  const offset = (page - 1) * limit;

  try {
    // creating the object to be used in the query.
    let obj = {};

    // Fix: Wrong way of handling Search and Filter
    // if (search != "" && filter == undefined) {
    //   obj = {
    //     $or: [
    //       { productName: { $regex: `${search}`, $options: "i" } },
    //       { category: { $regex: `${search}`, $options: "i" } },
    //     ],
    //   };
    //   console.log(obj, "only search");
    // }
    // // Fix: Wrong way of handling Search and Filter
    // if (filter && search == undefined) {
    //   obj = Object.assign(obj, filter);
    //   console.log(obj, "only filter");
    // } else if (search && filter) {
    //   obj = {
    //     $or: [
    //       { productName: { $regex: `${search}`, $options: "i" } },
    //       { category: { $regex: `${search}`, $options: "i" } },
    //     ],
    //   };
    //   obj = Object.assign(obj, filter);
    //   console.log(obj, "both search and filter");
    // }

    //  query to get the products.

    if (search) {
      console.log("in side the search field");
      obj.$or = [
        { productName: { $regex: `${search}`, $options: "i" } },
        { category: { $regex: `${search}`, $options: "i" } },
      ];
      console.log({ ...obj }, "object along the with the spread operator");
    }

    if (filter) {
      console.log({ ...filter });
      console.log("in side the filter field");
      
      obj = { ...obj, ...filter };
    }

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

    return res.status(StatusCodes.OK).json(product);
  } catch (err) {
    console.log("server error while gettings the proucts  BY ID:", err);
    Sentry.captureException(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "server error while gettings the products by id" });
  }
};

export const getMostRatingProducts = async (req, res) => {
  try {
    let pro = await Products.find({ Ratings: { $gt: 3.9 } });

    return res.status(StatusCodes.OK).json(pro);
  } catch (err) {
    console.log("server error while getting the most rating products", err);
    Sentry.captureException(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "server error while getting the most rating products" });
  }
};
