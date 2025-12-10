import express from "express";
import { upload } from "../middleware/uploadImage.js";

import {
  getAllPizzasAdmin,
  createPizza,
  updatePizza,
  deletePizza
} from "../controllers/admin-pizzas.controller.js";

const router = express.Router();

router.get("/", getAllPizzasAdmin);
router.post("/", upload.single("image"), createPizza);
router.put("/:id", upload.single("image"), updatePizza);
router.delete("/:id", deletePizza);

export default router;
