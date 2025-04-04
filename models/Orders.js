import express from "express";
import mongoose, { Query } from "mongoose";

const app = express();
app.use(express.json());

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  OrderedBy: {
    type: String,
    required: true,
  },

  ProductId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  productName: {
    type: String,
    required: true,
  },
  Quantity: {
    type: Number,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  bill: {
    type: Number,
    required: true,
  },
  OrderplacedDate: {
    type: Date,
    default: Date.now(),
    required: true,
  },
});

//module.exports=mongoose.model('User',userSchema);
export default mongoose.model("Orders", orderSchema);
