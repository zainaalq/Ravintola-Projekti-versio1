import {
  listUserFavorites,
  addFavorite,
  removeFavorite
} from "../models/favorites.model.js";

export const getUserFavorites = async (req, res) => {
  const userId = 1; 
  const favorites = await listUserFavorites(userId);
  res.json(favorites);
};

export const addUserFavorite = async (req, res) => {
  const userId = 1;
  const pizzaId = req.body.pizza_id;

  await addFavorite(userId, pizzaId);
  res.json({ success: true });
};

export const removeUserFavorite = async (req, res) => {
  const userId = 1;
  const pizzaId = req.body.pizza_id;

  await removeFavorite(userId, pizzaId);
  res.json({ success: true });
};
