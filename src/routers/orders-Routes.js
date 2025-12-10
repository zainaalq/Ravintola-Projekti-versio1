import express from "express";
import {
  placeOrder,
  adminGetOrders,
  changeOrderStatus,
  removeOrder
} from "../controllers/orders.controller.js";

const router = express.Router();

router.post("/", placeOrder);

router.get("/", adminGetOrders);

router.post("/status", changeOrderStatus);

router.post("/delete", removeOrder);

export default router;
