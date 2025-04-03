
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

    console.log("iam inside the add product controller");
    console.log("only request",req);

    console.log("only alog the user ",req.user); 
    // only alog the user  {
      //  id: '67ee4c40dd5149f6ae458830',
        // username: 'Rainacsk',
        // iat: 1743670354
      //}

    console.log("request with the req.user.id",req.user.id); // request with the req.user.id 67ee4c40dd5149f6ae458830


    let user=await UsersDetails.findById(req.user.id);

    console.log(user,"iam getting the user from the middleware and  using int he controlller in adding products ");

    let {productName,productDescription,price,quantityAvailable,category,Bookedproducts,manufactureredBy,Ratings}=req.body;

    try{

        let product=new Products({productName,productDescription,price,category,quantityAvailable,Bookedproducts,manufactureredBy,Ratings});

        await product.save();

        console.log("The product added successfully:", product);

        res
          .status(StatusCodes.CREATED)
          .json({ message: "The product added successfully" });

    }
    catch(err) {
        console.error("Error adding the product:", err);
   
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: "server Error while adding the products" });
    }
};

// using the params
export const getAllProducts=async(req,res)=>{
    console.log("hai")

    let ls=req.query;

    let obj={}

let k1=Object.keys(ls)

let v1=Object.values(ls)


for (let i=0;i<k1.length;i++){
    obj[k1[i]]=v1[i]

}

console.log(obj)

    
    for( let j in ls){
        console.log(j); // getting key
        console.log(ls[j]); // getting value
    }

    console.log(ls)

   

    let p={ls}


    try{

        let products=await Products.find(obj)

        console.log("The products are:", products);

        res
        .status(StatusCodes.OK)
        .json({products});


    }catch(err) {
        console.log("error while getting all  the products:")
        return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({error:"server error while getting the products"})


    }
};



// using the body
export const bodygetallproducts=async(req,res)=>{

    let {filter,search}=req.body;

    console.log(filter); 
    console.log(search);

    

    let obj={}

    

    if(filter==""&&search!=""){

        obj={$or:[{"productName":{$regex:`${search}`,$options:"i"}},{"category":{$regex:`${search}`,$options:"i"}}]}

    }
    else if(search==""&&filter!=""){

        if(filter.price&&filter.category==""){
            console.log("yes having only the price alone");

            obj={"price":{$lte:`${filter.price}`}}
        }

        else if(filter.price==""&&filter.category)
        {
            console.log("yes having only the category alone");

            obj={"category":`${filter.category}`}
        }

        else
        {
            obj={"category":`${filter.category}`,"price":{$lte:`${filter.price}`}}

        }


        console.log("iam in the filfetr here ");


    }

    else if(search!=""&&filter!="")
    {

        console.log("yes iam in both the search and filter")

        obj={$or:[{"productName":{$regex:`${search}`,$options:"i"}},{"category":{$regex:`${search}`,$options:"i"}}],}
    }
    else{
        obj={}
    }





   


 



    try{


        let data =await Products.find(obj)



       // console.log(data)

       if(data.length==0){
        res
        .status(StatusCodes.OK)
        .json("no products find ");
       }

        res
        .status(StatusCodes.OK)
        .json(data);





    }
    catch(err){

        console.log("error while getting all  the products:")
        return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({error:"server error while getting the products"})
    }



}


export const getProduct=async(req,res)=>
{
    try{
        let id=req.params.id;
        let product=await Products.findById(id);
        res
        .status(StatusCodes.OK)
        .json(product);

    }catch(err) {

        console.log("server error while gettings the proucts  BY ID")

        res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({error:"server error while gettings the products by id"})

    }
};

export const getMostRatingProducts=async(req,res)=>{

    try{

        let pro=await Products.find({ "Ratings":{$gt:3.9}})

    res.status(StatusCodes.OK)
    .json(pro);

    } catch(err) {
        console.log("server error while getting the most rating products")
        res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({error:"server error while getting the most rating products"})
    }
};
