import express from "express";

import {
  getAllPizzas,
  getPizzaDetails,
  createPizza,
  editPizza,
  removePizza,
} from "../controllers/menu-Controller.js";

const router = express.Router();

router.get("/", getAllPizzas);

router.get("/:id", getPizzaDetails);

router.post("/", createPizza);

router.put("/:id", editPizza);

router.delete("/:id", removePizza);

export default router;
