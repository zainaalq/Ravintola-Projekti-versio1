import express from "express";

import {
  getAllPizzas,
  getPizzaDetails,
  createPizza,
  editPizza,
  removePizza,
} from "../controllers/menu-Controller.js";

const router = express.Router();

// HAE KAIKKI PIZZAT TÄYTTEILLÄ
router.get("/", getAllPizzas);

//  HAE YKSI PIZZA TÄYTTEILLÄ
router.get("/:id", getPizzaDetails);

//  LISÄÄ UUSI PIZZA
router.post("/", createPizza);

//  PÄIVITÄ PIZZA
router.put("/:id", editPizza);

//  POISTA PIZZA
router.delete("/:id", removePizza);

export default router;
