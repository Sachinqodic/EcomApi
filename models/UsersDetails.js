import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  age:{
    type:Number,
    required:true,
  },
  Phone:{
    type:Number,
    required:true,
  },
  Address:{
    type:String,    
    required:true,
  }

  
})


//module.exports=mongoose.model('User',userSchema);
export default mongoose.model("UsersDetails", userSchema);
