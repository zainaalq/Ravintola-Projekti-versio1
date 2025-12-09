import express from "express";
import { requireAdmin } from "../middleware/authAdmin.js";

import {
  getAllAdminOrders,
  getAdminOrderById,
  updateAdminOrder,
  deleteAdminOrder
} from "../controllers/admin-orders.controller.js";

const router = express.Router();

router.get("/", requireAdmin, getAllAdminOrders);
router.get("/:id", requireAdmin, getAdminOrderById);
router.put("/:id", requireAdmin, updateAdminOrder);
router.delete("/:id", requireAdmin, deleteAdminOrder);

export default router;
