import express from "express";
import {
  getAllDrinks,
  getDrinkDetails,
  createDrink,
  editDrink,
  removeDrink
} from "../controllers/drinks-Controller.js";

const router = express.Router();

router.get("/", getAllDrinks);
router.get("/:id", getDrinkDetails);
router.post("/", createDrink);
router.put("/:id", editDrink);
router.delete("/:id", removeDrink);

export default router;
