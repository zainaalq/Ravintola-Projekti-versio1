import express from "express";
import { requireAdmin } from "../middleware/authAdmin.js";
import { upload } from "../middleware/uploadImage.js";

import {
  getAllDrinksAdmin,
  createDrink,
  updateDrink,
  deleteDrink
} from "../controllers/admin-drinks.controller.js";

const router = express.Router();

router.get("/", requireAdmin, getAllDrinksAdmin);
router.post("/", requireAdmin, upload.single("image"), createDrink);
router.put("/:id", requireAdmin, upload.single("image"), updateDrink);
router.delete("/:id", requireAdmin, deleteDrink);

export default router;
