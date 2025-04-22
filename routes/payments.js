import express from "express";
import auth from "../middleware/authmiddle.js";
import Role from "../middleware/adminRole.js";
import {
  payment,
  Adminchanges,
  getallPaidOrders,
  userConfirmation,
  webhooks,
  PayoutRequest,
  GetAllPayoutLists
  
} from "../controllers/payment.js";

const router = express.Router();

router.post("/pay/:id", auth, payment);

router.post('/webhook',express.raw({type:'application/json'}),webhooks)


router.post('/payoutcreate',PayoutRequest);

router.get('/payoutlist',GetAllPayoutLists);







router.get("/getallPaidOrders", auth, Role, getallPaidOrders); // PAGINATION

router.post("/tomaketransit/:id", auth, Role, Adminchanges);

router.post("/deliver/:id", auth, userConfirmation);

router.get("/success", (req, res) => {
  return res.json({ message: "payment successfull" });
});

router.get("/cancle", (req, res) => {
  return res.json({ message: "payment cancled here" });
});

export default router;
