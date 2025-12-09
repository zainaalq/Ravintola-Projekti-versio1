import express from "express";
import { requireAdmin } from "../middleware/authAdmin.js";
import { uploadImage } from "../middleware/uploadImage.js";
import {
  getAllPizzasAdmin,
  createPizza,
  updatePizza,
  deletePizza
} from "../controllers/admin-pizzas.controller.js";

const router = express.Router();

router.get("/", getAllPizzasAdmin);
router.post("/", uploadImage.single("image"), createPizza);
router.put("/:id", uploadImage.single("image"), updatePizza);
router.delete("/:id", deletePizza);

export default router;
