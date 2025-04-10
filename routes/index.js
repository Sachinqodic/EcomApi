import express from "express";
import authRou from "./auth.js";
import Booking from "./orders.js";
import eventRou from "./productsadding.js";
import payment from "./payments.js";

const routes = express.Router();

routes.use("/auth", authRou);
routes.use("/product", eventRou);
routes.use("/booking", Booking);
routes.use("/payment", payment);

export default routes;
