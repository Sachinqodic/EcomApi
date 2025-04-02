
import express from "express";
import mongoose from "mongoose";


const app = express();
app.use(express.json());

const orderSchema = new mongoose.Schema({


    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },

    OrderedBy:{
        type:string,
        required:true
    },

    ProductId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true                         
    },


  productName: {
    type: String,
    required: true,
  },
 
  price:{
    type:Number,
    required:true,
  },


  bill:{
    type:Number,
    required:true,
  }

  
})


//module.exports=mongoose.model('User',userSchema);
export default mongoose.model("Orders", orderSchema);
