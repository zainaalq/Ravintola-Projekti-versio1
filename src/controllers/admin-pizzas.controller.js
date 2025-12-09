import db from "../utils/database.js";

export const getAllPizzasAdmin = async (req, res) => {
  const [rows] = await db.query(`
    SELECT id, name, description, base_price, image
    FROM menu_items
    ORDER BY id DESC
  `);

  res.json(rows);
};

export const createPizza = async (req, res) => {
  const { name, description, base_price } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!name || !description || !base_price) {
    return res.status(400).json({ error: "Missing fields" });
  }

  await db.execute(
    "INSERT INTO menu_items (name, description, base_price, image) VALUES (?, ?, ?, ?)",
    [name, description, base_price, image]
  );

  res.json({ success: true });
};

export const updatePizza = async (req, res) => {
  const { id } = req.params;
  const { name, description, base_price, old_image } = req.body;

  const image = req.file ? req.file.filename : old_image;

  await db.execute(
    `UPDATE menu_items
     SET name = ?, description = ?, base_price = ?, image = ?
     WHERE id = ?`,
    [name, description, base_price, image, id]
  );

  res.json({ success: true });
};

export const deletePizza = async (req, res) => {
  const { id } = req.params;

  await db.execute("DELETE FROM menu_items WHERE id = ?", [id]);

  res.json({ success: true });
};
