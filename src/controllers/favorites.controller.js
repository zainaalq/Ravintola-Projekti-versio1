// src/controllers/favorites.controller.js
import {
  listUserFavorites,
  addFavorite,
  removeFavorite
} from "../models/favorites.model.js";

// GET /api/favorites
export const getUserFavorites = async (req, res) => {
  const userId = 1; // testikäyttäjä
  const favorites = await listUserFavorites(userId);
  res.json(favorites);
};

// POST /api/favorites/add
export const addUserFavorite = async (req, res) => {
  const userId = 1;
  const pizzaId = req.body.pizza_id;

  await addFavorite(userId, pizzaId);
  res.json({ success: true });
};

// POST /api/favorites/remove
export const removeUserFavorite = async (req, res) => {
  const userId = 1;
  const pizzaId = req.body.pizza_id;

  await removeFavorite(userId, pizzaId);
  res.json({ success: true });
};
