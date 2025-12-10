import db from "../utils/database.js";

export const listUserFavorites = async (userId) => {
  try {
    const [rows] = await db.query(
      `SELECT m.*
       FROM favorites f
       JOIN menu_items m ON m.id = f.pizza_id
       WHERE f.user_id = ?`,
      [userId]
    );

    return rows; 
  } catch (err) {
    console.error("listUserFavorites error:", err);
    return [];
  }
};

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
