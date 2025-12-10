import db from "../utils/database.js";


function getPizzaImagePath(filename) {
  if (!filename) return null;

  
  const isOld = !filename.includes("-");

  if (isOld) {
    
    return `/kuvat/${filename}`;
  }

  
  
  return `/uploads/${filename}`;
}


export const getAllPizzasAdmin = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, name, description, base_price, image
      FROM menu_items
      ORDER BY id ASC
    `);

    const pizzas = rows.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: Number(p.base_price),       
      image: getPizzaImagePath(p.image)  
    }));

    res.json(pizzas);

  } catch (err) {
    console.error("GET ALL PIZZAS ERROR:", err);
    res.status(500).json({ success: false });
  }
};


export const createPizza = async (req, res) => {
  try {
    const { name, description, base_price } = req.body;
    const file = req.file ? req.file.filename : null;

    if (!name || !base_price) {
      return res.status(400).json({ error: "name and base_price required" });
    }

    const [result] = await db.execute(
      `INSERT INTO menu_items (name, description, base_price, image)
       VALUES (?, ?, ?, ?)`,
      [name, description, base_price, file]
    );

    res.json({
      success: true,
      id: result.insertId
    });

  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ success: false });
  }
};


export const updatePizza = async (req, res) => {
  try {
    const id = req.params.id;

    const { name, description, base_price } = req.body;
    const newImage = req.file ? req.file.filename : null;

    const [old] = await db.execute(
      "SELECT image FROM menu_items WHERE id = ?",
      [id]
    );

    if (!old.length) {
      return res.status(404).json({ success: false, msg: "Pizza not found" });
    }

    const finalImage = newImage ? newImage : old[0].image;

    await db.execute(
      `UPDATE menu_items
       SET name=?, description=?, base_price=?, image=?
       WHERE id=?`,
      [name, description, base_price, finalImage, id]
    );

    res.json({ success: true });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ success: false });
  }
};


export const deletePizza = async (req, res) => {
  try {
    const id = req.params.id;

    await db.execute("DELETE FROM menu_items WHERE id=?", [id]);

    res.json({ success: true });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ success: false });
  }
};
