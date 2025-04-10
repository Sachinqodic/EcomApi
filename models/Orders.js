import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "UsersDetails",
  },

  OrderedBy: {
    type: String,
    required: true,
  },

  ProductsIdList: {
    type: Array,
    required: true,
  },

  Total_bill: {
    type: Number,
    required: true,
  },
  Order_Summary: {
    type: Array,
    required: true,
  },

  OrderplacedDate: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  PaymentStatus: {
    type: String,
    required: true,
    enum: ["Paid", "Pending"],
    default: "Pending",
  },

  ShipmentStatus: {
    type: String,
    required: true,
    enum: ["confirmed", "Pending", "InTransit", "Received"],
    default: "Pending",
  },
});

orderSchema.index({ OrderplacedDate: -1 });

//orderSchema.index({userId:"hashed"});

export default mongoose.model("Orders", orderSchema);
