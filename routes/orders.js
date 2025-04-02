// import express from "express";
// import cors from "cors";


// import {
//   myorders,
//   booking
  
// } from "../controllers/v1/eventopera.js";

// import UeventbookValidation from "../validators/booking.js";

// import { ReasonPhrases, StatusCodes } from "http-status-codes";

// const app = express();
// app.use(express());
// app.use(cors());

// const router = express.Router();



// router.post(
//   "/booking/:id",

//   async (req, res) => {

//     let { error: NoSeatsError } =
//       UeventbookValidation.userNoOfSeatsValidation.validate(req.body);

//     if (NoSeatsError) {
//       return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
//         error: ReasonPhrases.BAD_REQUEST,
//         message: routesmessages.bookingroutes.bookingeventB,
//       });
//     }

//     await booking(req,res);
//   }
// );


// router.get(
//   "/myorders",

//   async (req, res) => {


//     myorders(req, res);
    
//   }
// );

// export default router;