import "../instrument.js";
import * as Sentry from "@sentry/node";
import dotenv from "dotenv";
import Orders from "../models/Orders.js";
import Products from "../models/Products.js";
import { StatusCodes } from "http-status-codes";
import Stripe from "stripe";
import { cancelorder } from "./bookings.js";

dotenv.config();
const stripe = new Stripe(process.env.SECRET_KEY);

// Payment_intents_api

//ERROR: server error while making the paynment: StripeInvalidRequestError: Sending credit card numbers directly to the Stripe API
// is generally unsafe. We suggest you use test tokens that map to the test card you are using, see https://stripe.com/docs/testing.
// To enable testing raw card data APIs, see https://support.stripe.com/questions/enabling-access-to-raw-card-data-apis.

// export const payment = async (req, res) => {
//   let { id } = req.params;
//   let { card } = req.body;

//   console.log(card);

//   try {
//     let order = await Orders.findById(id);
//     //console.log(order);

//     console.log(order.Total_bill);
//     res.status(StatusCodes.OK).json(order);

//     const paymentMethod = await stripe.paymentMethods.create({
//       type: "card",
//       card: {
//         number: card.number,
//         exp_month: card.exp_month,
//         exp_year: card.exp_year,
//         cvc: card.cvc,
//       },
//     });

//     // console.log(paymentMethod);

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: order.Total_bill * 100,
//       currency: "usd",
//       payment_method: paymentMethod.id,
//       confirm: true,
//       payment_method_types: ["card"],
//     });

//     console.log(paymentIntent);

//     // order.PaymentStatus = "Paid";
//     // order.ShipmentStatus = "confirmed";
//     // await order.save();

//     // return res.status(StatusCodes.OK).json({ message: "Payment successful",paymentIntent });
//   } catch (err) {
//     console.log("server error while making the paynment:", err);
//     Sentry.captureException(err);

//     return res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ error: "server error while making the payment" });
//   }

// };

// Stripe Checkout Api
// ...> for making the payment here :
export const payment = async (req, res) => {
  let { id } = req.params;

  const { event } = req.body;

  try {
    let order = await Orders.findById(id);
    //console.log(order);

    console.log(order.Total_bill);

    let f = order.ProductsIdList.length;

    console.log(f);

    const lineItems = order.Order_Summary.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.productName,
            description: `Quantity: ${item.Quantity}`,
          },

          unit_amount: item.Total * 100,
        },

        quantity: item.Quantity,
      };
    });

    console.log(lineItems);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["US", "IN"],
      },
      line_items: lineItems,

      mode: "payment",
      success_url: "http://localhost:3011/payment/success",
      cancel_url: "http://localhost:3011/payment/cancle",
    });

    console.log(session);
    res.json({ id: session.id });

    // order.PaymentStatus = "Paid";
    // order.ShipmentStatus = "confirmed";
    // await order.save();

    // return res.status(StatusCodes.OK).json({ message: "Payment successful",paymentIntent });
  } catch (err) {
    console.log("server error while making the paynment:", err);
    Sentry.captureException(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "server error while making the payment" });
  }
};

export const webhooks = async (req, res) => {};

// Getting error here because in the stripe dashboard  bank account not integrated.
// To create the payout request
export const PayoutRequest = async (req, res) => {
  let { amount } = req.body;
  console.log(amount);
  try {
    let payout = await stripe.payouts.create({
      amount: amount,
      currency: "usd",
    });

    console.log(payout);

    return res.send(StatusCodes.OK).json({ payout });
  } catch (err) {
    console.log("server error here while making the payout_Request", err);
    Sentry.captureException(err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "server error while creating the payout request" });
  }
};

// To get the list of the payout request
export const GetAllPayoutLists = async (req, res) => {
  try {
    const payouts = await stripe.payouts.list({
      limit: 3,
    });

    return res.send(StatusCodes.OK).json({ payouts });
  } catch (err) {
    console.log("server error here while retriveing the payoutlists", err);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "server error while retriveing the payoutlists" });
  }
};

// To update the payout after creation
export const updatePayout = async (req, res) => {};

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
