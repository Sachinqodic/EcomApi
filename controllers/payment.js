import "../instrument.js";
import * as Sentry from "@sentry/node";
import dotenv from "dotenv";
import Orders from "../models/Orders.js";
import Products from "../models/Products.js";
import { StatusCodes } from "http-status-codes";
// import Stripe from "stripe";

// dotenv.config();
// const stripe = new Stripe(process.env.SECRET_KEY);




export const payment = async (req, res) => {
  let { id } = req.params;
  // let { amount } = req.body;

  try {
    let order = await Orders.findById(id);
    console.log(order);
    res.status(StatusCodes.OK).json(order);

    order.PaymentStatus = "Paid";
    order.ShipmentStatus = "confirmed";
    await order.save();

    return res.status(StatusCodes.OK).json({ message: "Payment successful" });
  } catch (err) {
    console.log("server error while making the paynment:", err);
    Sentry.captureException(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "server error while making the payment" });
  }
};

export const Adminchanges = async (req, res) => {
  let { id } = req.params;

  try {
    let order = await Orders.findById(id);

    console.log(order);

    if (order.ShipmentStatus == "confirmed") {
      order.ShipmentStatus = "InTransit";
    }
    await order.save();

    return res.status(StatusCodes.OK).json(order);
  } catch (err) {
    console.log("Server error while changing the Shipment status:", err);
    Sentry.captureException(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Server error while changing the Shipment status" });
  }
};

export const getallPaidOrders = async (req, res) => {
  //pagination
  let { page, limit } = req.query;
  let offset = (page - 1) * limit;

  try {
    let paidOrders = await Orders.aggregate([
      { $match: { PaymentStatus: "Paid", ShipmentStatus: "confirmed" } },

      { $project: { Order_Summary: 0, ProductsIdList: 0 } },
    ])
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    return res.status(StatusCodes.OK).json(paidOrders);
  } catch (err) {
    console.log("server error while getting the paid orders", err);
    Sentry.captureException(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "server error while getting the paid orders by admin" });
  }
};

export const userConfirmation = async (req, res) => {
  let { id } = req.params;

  try {
    let order = await Orders.findById(id);

    if (
      order.userId.toString() == req.user.id &&
      order.PaymentStatus == "Paid" &&
      order.ShipmentStatus == "InTransit"
    ) {
      order.ShipmentStatus = "Received";
    }

    await order.save();

    return res
      .status(StatusCodes.OK)
      .json({ message: "Order delivered successfully" });
  } catch (err) {
    console.log("server error while confirming the order:", err);
    Sentry.captureException(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "server error while confirming the order" });
  }
};
