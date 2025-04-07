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
});

//module.exports=mongoose.model('User',userSchema);
export default mongoose.model("Orders", orderSchema);
