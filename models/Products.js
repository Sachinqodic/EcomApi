
import express from "express";
import mongoose from "mongoose";


const app = express();
app.use(express.json());

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  price:{
    type:Number,
    required:true,
  },


  quantityAvailable:{
    type:Number,
    required:true,
  },

    manufactureredBy:{
    type:String,    
    required:true,
  },
  Ratings:{
    type:Number,    
    required:true,
  }

  
})


//module.exports=mongoose.model('User',userSchema);
export default mongoose.model("Products", productSchema);
