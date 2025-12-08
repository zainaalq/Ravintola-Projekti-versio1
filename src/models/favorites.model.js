// src/models/favorites.model.js
import db from "../utils/database.js";

// Hae käyttäjän suosikkipizzat (palauttaa pizzaobjektit)
export const listUserFavorites = async (userId) => {
  try {
    const [rows] = await db.query(
      `SELECT m.*
       FROM favorites f
       JOIN menu_items m ON m.id = f.pizza_id
       WHERE f.user_id = ?`,
      [userId]
    );

    return rows; // palautetaan koko pizza-data
  } catch (err) {
    console.error("listUserFavorites error:", err);
    return [];
  }
};

// Lisää suosikki
export const addFavorite = async (userId, pizzaId) => {
  try {
    await db.query(
      "INSERT INTO favorites (user_id, pizza_id) VALUES (?, ?)",
      [userId, pizzaId]
    );
  } catch (err) {
    console.error("addFavorite error:", err);
  }
};

// Poista suosikki
export const removeFavorite = async (userId, pizzaId) => {
  try {
    await db.query(
      "DELETE FROM favorites WHERE user_id = ? AND pizza_id = ?",
      [userId, pizzaId]
    );
  } catch (err) {
    console.error("removeFavorite error:", err);
  }
};
