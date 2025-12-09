import db from "../utils/database.js";

export const AdminDrinksModel = {
  getAll: async () => {
    const sql = `
      SELECT d.id, d.name, d.image,
        s1.price AS small_price,
        s2.price AS large_price
      FROM drinks d
      LEFT JOIN drink_sizes s1 ON d.id = s1.drink_id AND s1.size = 'Small'
      LEFT JOIN drink_sizes s2 ON d.id = s2.drink_id AND s2.size = 'Large'
      ORDER BY d.id DESC
    `;
    const [rows] = await db.query(sql);
    return rows;
  },

  addDrink: async ({ name, image, small_price, large_price }) => {
    const [drinkRes] = await db.query(
      "INSERT INTO drinks (name, image) VALUES (?, ?)",
      [name, image]
    );

    const drinkId = drinkRes.insertId;

    await db.query(
      "INSERT INTO drink_sizes (drink_id, size, price) VALUES (?, 'Small', ?)",
      [drinkId, small_price]
    );

    await db.query(
      "INSERT INTO drink_sizes (drink_id, size, price) VALUES (?, 'Large', ?)",
      [drinkId, large_price]
    );

    return { id: drinkId };
  },

  updateDrink: async (id, { name, image, small_price, large_price }) => {
    await db.query(
      "UPDATE drinks SET name=?, image=? WHERE id=?",
      [name, image, id]
    );

    await db.query(
      "UPDATE drink_sizes SET price=? WHERE drink_id=? AND size='Small'",
      [small_price, id]
    );

    await db.query(
      "UPDATE drink_sizes SET price=? WHERE drink_id=? AND size='Large'",
      [large_price, id]
    );

    return true;
  },

  deleteDrink: async (id) => {
    await db.query("DELETE FROM drinks WHERE id=?", [id]);
    return true;
  }
};
