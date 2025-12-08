import express from "express";
import {
  placeOrder,
  adminGetOrders,
  changeOrderStatus,
  removeOrder
} from "../controllers/orders.controller.js";

const router = express.Router();

// Asiakkaan uuden tilauksen luonti
router.post("/", placeOrder);

// Admin: hae kaikki tilaukset
router.get("/", adminGetOrders);

// Admin: muuta tilausta (pending → accepted → delivered)
router.post("/status", changeOrderStatus);

// Admin: poista tilaus
router.post("/delete", removeOrder);

export default router;
