
import express from "express";
import cors from "cors";



import UsersDetails from "../models/UsersDetails.js";
import Products from "../models/Products.js";
import Orders from "../models/Orders.js";


import {
  StatusCodes
} from "http-status-codes";

const app = express();

// Middleware to parse JSON
app.use(express.json()); 

app.use(cors());

console.log("Starting authopera.js...");


export const booking=async(req,res)=>{

    let {NoOfItems,name}=req.body;

    try{
        const used=await UsersDetails.find({username:name})

        const event = await Products.findById(req.params.id);

        console.log("Events details:", event);
    
        if (event.quantityAvailable === 0) {
          return res
            .status(StatusCodes.REQUEST_TIMEOUT)
            .json({ message: "No more seats available for booking" });
        }
    
        if (NoOfItems > event.quantityAvailable) {
          return res
            .status(StatusCodes.GONE)
            .json({
              message: `maximum number of seats can be booked :${event.quantityAvailable}, so please reduce the number of seats`,
            });
        }
    
        console.log(event);

    }
    catch{
        console.error("Error adding the product:", err);
   
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: "server Error while adding the products" });
    }
};


export const myorders=async(req,res)=>{

    try{

        let id=req.params.id;

        let orders=await Orders.find({})



    }catch{
        console.log("error while getting all  the orders:");
        return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({error:"server error while getting the all my orders"})
    }
}


