import express from "express";
import {
  getUserFavorites,
  addUserFavorite,
  removeUserFavorite
} from "../controllers/favorites.controller.js";

const router = express.Router();

router.get("/", getUserFavorites);
router.post("/add", addUserFavorite);
router.post("/remove", removeUserFavorite);

export default router;
