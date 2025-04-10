import "../instrument.js";
import * as Sentry from "@sentry/node";
import Orders from "../models/Orders.js";
import Products from "../models/Products.js";
import { StatusCodes } from "http-status-codes";
import UsersDetails from "../models/UsersDetails.js";
import mongoose, { ObjectId } from "mongoose";

// single product booking
export const booking = async (req, res) => {
  let { NoOfItems } = req.body;
  let user = await UsersDetails.findById(req.user.id);

  try {
    const product = await Products.findById(req.params.id);

    console.log("product details:", product);

    if (product.quantityAvailable === 0) {
      return res
        .status(StatusCodes.REQUEST_TIMEOUT)
        .json({ message: "No more seats available for booking" });
    }

    if (NoOfItems > product.quantityAvailable) {
      return res.status(StatusCodes.GONE).json({
        message: `maximum number of prodcuts can be booked :${product.quantityAvailable}, so please reduce the number of products`,
      });
    }

    console.log(product);

    let userId = user.id;

    let OrderedBy = user.username;

    let ProductId = product.id;
    let productName = product.productName;
    let price = product.price;
    let Quantity = req.body.NoOfItems;
    let bill = product.price * NoOfItems;
    let category = product.category;

    console.log({ userId, OrderedBy, ProductId, productName, price, bill });

    let order = await Orders.create({
      userId,
      OrderedBy,
      ProductId,
      productName,
      Quantity,
      price,
      bill,
      category,
    });

    console.log(order.ProductName);
    //await order.save();

    const productInfo = await Products.findById(req.params.id);

    console.log(productInfo, "product info");

    // eventInfo.countid=eventInfo.countid+1;

    // console.log(eventInfo.countid,"count id is updated.");

    // if(eventInfo.countid>=5){
    //   eventInfo.topOrdered=true;

    // }
    console.log(productInfo.topOrdered, "top ordered is updated.");

    (productInfo.Bookedproducts = productInfo.Bookedproducts + NoOfItems),
      (productInfo.quantityAvailable =
        productInfo.quantityAvailable - NoOfItems);

    await productInfo.save();

    console.log("The product added successfully:", productInfo);

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

// multiple products booking
export const multipleProductsbooking = async (req, res) => {
  let booking = req.body;
  let user = await UsersDetails.findById(req.user.id);

  console.log(user);
  console.log(booking);

  try {
    let userId = user.id;
    let OrderedBy = user.username;
    let ProductsIdList = [];
    let Total_bill = 0;
    let Order_Summary = [];

    for (let i = 0; i < booking.length; i++) {
      ProductsIdList.push(booking[i].productid);

      let res = await Products.findById(booking[i].productid);
      Total_bill = Total_bill + res.price * booking[i].Noofitems;

      let productid = booking[i].productid;
      let productName = res.productName;
      let Quantity = booking[i].Noofitems;
      let price = res.price;
      let Total = booking[i].Noofitems * res.price;

      Order_Summary.push({ productid, productName, Quantity, price, Total });
    }

    let order = await Orders.create({
      userId,
      OrderedBy,
      ProductsIdList,
      Total_bill,
      Order_Summary,
    });

    //await order.save();
    console.log(order);

    booking.forEach(demo);

    async function demo(x) {
      console.log(x.productid, x.Noofitems);

      const productInfo = await Products.findById(x.productid);

      (productInfo.Bookedproducts = productInfo.Bookedproducts + x.Noofitems),
        (productInfo.quantityAvailable =
          productInfo.quantityAvailable - x.Noofitems);

      await productInfo.save();
    }

    return res.status(StatusCodes.OK).json(order);
  } catch (err) {
    console.log("server error while booking the products:", err);
    Sentry.captureException(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "server Error while adding the products" });
  }
};

export const getallorders = async (req, res) => {
  const { page, limit } = req.query;
  const offset = (page - 1) * limit;

  console.log(req.user);
  console.log(req.user.id);
  console.log(req.user.username);
  console.log(req.user.role);

  try {
    let allorders = await Orders.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(req.user.id) },
      },
      {
        $project: { Order_Summary: 0 },
      },
      {
        $sort: { OrderplacedDate: -1 },
      },
    ])
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    if (allorders.length == 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No orders found",
      });
    }

    return res.status(StatusCodes.OK).json(allorders);
  } catch (err) {
    console.log("error while getting all  the orders:", err);
    Sentry.captureException(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "server error while getting the all orders" });
  }
};

export const orderDetails = async (req, res) => {
  const { page, limit } = req.query;
  const offset = (page - 1) * limit;

  try {
    let allorders = await Orders.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(req.user.id) },
        //$match: { userId: req.user.id},
      },
      {
        $project: { Order_Summary: 1, OrderplacedDate: 1 },
      },
      {
        $sort: { OrderplacedDate: -1 },
      },
    ])
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    return res.status(StatusCodes.OK).json(allorders);
  } catch (err) {
    consosle.log("server error while getting the order details:", err);
    Sentry.captureException(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "server error while getting the order details." });
  }
};

export const myorders = async (req, res) => {
  try {
    let id = req.params.id;
    let orders = await Orders.findById(id);

    return res.status(StatusCodes.OK).json(orders);
  } catch (err) {
    console.log("error while getting all  the orders:", err);
    Sentry.captureException(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "server error while getting the all my orders" });
  }
};

export const updatingbooking = async (req, res) => {
  let { NoOfItems } = req.body;

  try {
    const book = await Orders.findByIdAndUpdate(req.params.id);

    if (!book || book.userId.toString() !== req.user.id) {
      return res.status(StatusCodes.GONE).json({
        error:
          "id invalid or id not found in the orders collection while updating the orders",
      });
    }

    const productInfoUpdation = await Products.findByIdAndUpdate(
      book.ProductId
    );

    if (NoOfItems > productInfoUpdation.quantityAvailable) {
      return res.status(StatusCodes.UNSUPPORTED_MEDIA_TYPE).json({
        message: `maximum number of items can be ordered :${productInfoUpdation.quantityAvailable}, so please reduce the number of items`,
      });
    }

    if (book.Quantity === NoOfItems) {
      return res.status(208).json({
        message: "You have already ordered the same number of items",
      });
    }

    if (NoOfItems) {
      if (book.Quantity > NoOfItems) {
        productInfoUpdation.quantityAvailable =
          productInfoUpdation.quantityAvailable + (book.Quantity - NoOfItems);

        productInfoUpdation.Bookedproducts =
          productInfoUpdation.Bookedproducts - (book.Quantity - NoOfItems);

        book.bill = NoOfItems * productInfoUpdation.price;

        book.Quantity = NoOfItems;
      } else if (book.Quantity < NoOfItems) {
        productInfoUpdation.quantityAvailable =
          productInfoUpdation.quantityAvailable - (NoOfItems - book.Quantity);

        productInfoUpdation.Bookedproducts =
          productInfoUpdation.Bookedproducts + (NoOfItems - book.Quantity);

        book.bill = NoOfItems * productInfoUpdation.price;

        book.Quantity = NoOfItems;
      }
    }

    await productInfoUpdation.save();
    await book.save();

    return res.status(StatusCodes.OK).json(book);
  } catch (err) {
    console.log("server error while updating the order:", err);
    Sentry.captureException(err);

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "server error while updating the orders" });
  }
};

export const cancelorder = async (req, res) => {
  try {
    const product = await Orders.findByIdAndDelete(req.params.id);

    console.log("Order details:", product);

    if (!product || product.userId.toString() !== req.user.id) {
      return res.status(StatusCodes.REQUEST_TIMEOUT).json({
        message: "id invalid or id not found in the orders collection",
      });
    }

    const NoOfItemsForBooked = product.Quantity;

    const products = await Products.findByIdAndUpdate(product.ProductId);

    products.countid = products.countid - 1;

    // if (products.countid < 5) {
    //   products.topOrdered = false;
    // }

    products.Bookedproducts = products.Bookedproducts - NoOfItemsForBooked;
    products.quantityAvailable =
      products.quantityAvailable + NoOfItemsForBooked;

    await products.save();
    return res
      .status(StatusCodes.OK)
      .json({ message: "Order cancelled successfully" });
  } catch (err) {
    console.log("server error while cancelling the booking");
    Sentry.captureException(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "server Error while canceling the orders" });
  }
};
