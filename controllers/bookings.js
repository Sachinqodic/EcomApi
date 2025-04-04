import express from "express";
import cors from "cors";

import UsersDetails from "../models/UsersDetails.js";
import Products from "../models/Products.js";
import Orders from "../models/Orders.js";

import { StatusCodes } from "http-status-codes";

const app = express();

// Middleware to parse JSON
app.use(express.json());

app.use(cors());

console.log("Starting authopera.js...");

export const booking = async (req, res) => {
  let { NoOfItems } = req.body;

  let user = await UsersDetails.findById(req.user.id);

  try {
    //let user=await UsersDetails.findById(req.user.id);

    // console.log(user)
    const event = await Products.findById(req.params.id);

    console.log("Events details:", event);

    if (event.quantityAvailable === 0) {
      return res
        .status(StatusCodes.REQUEST_TIMEOUT)
        .json({ message: "No more seats available for booking" });
    }

    if (NoOfItems > event.quantityAvailable) {
      return res.status(StatusCodes.GONE).json({
        message: `maximum number of seats can be booked :${event.quantityAvailable}, so please reduce the number of seats`,
      });
    }

    console.log(event);

    let userId = user.id;

    let OrderedBy = user.username;

    let ProductId = event.id;
    let productName = event.productName;
    let price = event.price;
    let Quantity = req.body.NoOfItems;
    let bill = event.price * NoOfItems;
    let category = event.category;

    console.log({ userId, OrderedBy, ProductId, productName, price, bill });

    let order = new Orders({
      userId,
      OrderedBy,
      ProductId,
      productName,
      Quantity,
      price,
      bill,
      category,
    });

    await order.save();

    const eventInfo = await Products.findById(req.params.id);

    console.log(eventInfo, "product info");

    // eventInfo.countid=eventInfo.countid+1;

    // console.log(eventInfo.countid,"count id is updated.");

    // if(eventInfo.countid>=5){
    //   eventInfo.topOrdered=true;

    // }
    console.log(eventInfo.topOrdered, "top ordered is updated.");

    (eventInfo.Bookedproducts = eventInfo.Bookedproducts + NoOfItems),
      (eventInfo.quantityAvailable = eventInfo.quantityAvailable - NoOfItems);

    await eventInfo.save();

    console.log("The product added successfully:", eventInfo);

    res
      .status(StatusCodes.CREATED)
      .json({ message: "The product added successfully" });
  } catch (err) {
    console.error("Error adding the product:", err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "server Error while adding the products" });
  }
};

export const getallorders = async (req, res) => {
  try {
    let allorders = await Orders.find({});

    console.log("The orders are:", allorders);

    let alll = await Orders.aggregate([
      {
        $project: { productName: 1, Quantity: 1, bill: 1, OrderplacedDate: 1 },
      },
    ]);

    res.status(StatusCodes.OK).json(alll);
  } catch (err) {
    console.log("error while getting all  the orders:");
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "server error while getting the all orders" });
  }
};

export const myorders = async (req, res) => {
  try {
    let id = req.params.id;

    let orders = await Orders.findById(id);

    res.status(StatusCodes.OK).json(orders);
  } catch (err) {
    console.log("error while getting all  the orders:");
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "server error while getting the all my orders" });
  }
};

export const updatingbooking = async (req, res) => {
  let { NoOfItems } = req.body;

  try {
    console.log(req.user.id, "fecthing the user id");
    const book = await Orders.findByIdAndUpdate(req.params.id);
    console.log(book, "this is booking data");

    if (!book || book.userId.toString() !== req.user.id) {
      return res
        .status(StatusCodes.GONE)
        .json({
          error:
            "id invalid or id not found in the orders collection while updating the orders",
        });
    }

    const eventInfoUpdation = await Products.findByIdAndUpdate(book.ProductId);

    if (NoOfItems > eventInfoUpdation.quantityAvailable) {
      return res.status(StatusCodes.UNSUPPORTED_MEDIA_TYPE).json({
        message: `maximum number of items can be ordered :${eventInfoUpdation.quantityAvailable}, so please reduce the number of items`,
      });
    }

    if (book.Quantity === NoOfItems) {
      return res.status(208).json({
        message: "You have already ordered the same number of items",
      });
    }

    if (NoOfItems) {
      if (book.Quantity > NoOfItems) {
        eventInfoUpdation.quantityAvailable =
          eventInfoUpdation.quantityAvailable + (book.Quantity - NoOfItems);

        eventInfoUpdation.Bookedproducts =
          eventInfoUpdation.Bookedproducts - (book.Quantity - NoOfItems);

        book.bill = NoOfItems * eventInfoUpdation.price;

        book.Quantity = NoOfItems;
      } else if (book.Quantity < NoOfItems) {
        eventInfoUpdation.quantityAvailable =
          eventInfoUpdation.quantityAvailable - (NoOfItems - book.Quantity);

        eventInfoUpdation.Bookedproducts =
          eventInfoUpdation.Bookedproducts + (NoOfItems - book.Quantity);

        book.bill = NoOfItems * eventInfoUpdation.price;

        book.Quantity = NoOfItems;
      }
    }
    await eventInfoUpdation.save();

    await book.save();

    res.status(StatusCodes.OK).json(book);
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "server error while updating the orders" });
  }
};

export const cancelorder = async (req, res) => {
  try {
    const event = await Orders.findByIdAndDelete(req.params.id);

    console.log("Order details:", event);
    console.log("User details:", req.user.id);

    if (!event || event.userId.toString() !== req.user.id) {
      return res.status(StatusCodes.REQUEST_TIMEOUT).json({
        message: "id invalid or id not found in the orders collection",
      });
    }

    const NoOfItemsForBooked = event.Quantity;

    const events = await Products.findByIdAndUpdate(event.ProductId);

    events.countid = events.countid - 1;

    console.log(events.countid, "count id is updated.");

    if (events.countid < 5) {
      events.topOrdered = false;
    }
    console.log(events.topOrdered, "top ordered is updated.");

    events.Bookedproducts = events.Bookedproducts - NoOfItemsForBooked;

    events.quantityAvailable = events.quantityAvailable + NoOfItemsForBooked;

    await events.save();
    res
      .status(StatusCodes.OK)
      .json({ message: "Order cancelled successfully" });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "server Error while canceling the orders" });
  }
};
