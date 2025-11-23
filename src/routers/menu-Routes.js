import express from "express";

import {
  getAllPizzas,
  getPizzaDetails,
  createPizza,
  editPizza,
  removePizza,
} from "../controllers/menu-Controller.js";

const router = express.Router();

// GET -> kaikki pizzat
router.get("/", getAllPizzas);

// GET -> yksittäinen pizza id:llä
router.get("/:id", getPizzaDetails);


// POST -> lisää uusi pizza
router.post("/", createPizza);

// PUT -> päivitä pizza
router.put("/:id", editPizza);

// DELETE -> poista pizza
router.delete("/:id", removePizza);

export default router;
