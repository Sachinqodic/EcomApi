
import express from "express";
import cors from "cors";



import UsersDetails from "../models/UsersDetails.js";
import Products from "../models/Products.js";


import {
  StatusCodes
} from "http-status-codes";

const app = express();

// Middleware to parse JSON
app.use(express.json());

app.use(cors());

console.log("Starting authopera.js...");


export const AddingProduct=async(req,res)=>{

    let {productName,productDescription,price,quantityAvailable,manufactureredBy,Ratings}=req.body;

    try{

        let product=new Products({productName,productDescription,price,quantityAvailable,manufactureredBy,Ratings});

        await product.save();

        console.log("The product added successfully:", product);

        res
          .status(StatusCodes.CREATED)
          .json({ message: "The product added successfully" });

    }
    catch{
        console.error("Error adding the product:", err);
   
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: "server Error while adding the products" });
    }
};


export const getAllProducts=async(req,res)=>{


    try{

        let products=await Products.find({});

        console.log("The products are:", products);

        res
        .status(StatusCodes.OK)
        .json({products});


    }catch{
        console.log("error while getting all  the products:")
        return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({error:"server error while getting the products"})


    }
};

export const getProduct=async(req,res)=>
{
    try{
        let id=req.params.id;
        let product=await Products.findById(id);
        res
        .status(StatusCodes.OK)
        .json(product);

    }catch{

        console.log("server error while gettings the proucts  BY ID")

        res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({error:"server error while gettings the products by id"})

    }
}

export const getMostRatingProducts=async(req,res)=>{

    try{

        let pro=await Products.find({ "Ratings":{$gt:3.9}})

    res.status(StatusCodes.OK)
    .json(pro);

    } catch{
        console.log("server error while getting the most rating products")
        res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({error:"server error while getting the most rating products"})
    }
}
