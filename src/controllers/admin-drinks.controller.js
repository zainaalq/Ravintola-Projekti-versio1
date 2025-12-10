import db from "../utils/database.js";

function getDrinkImagePath(filename) {
  if (!filename) return null;

  const isOld = !filename.includes("-");  

  if (isOld) {
    return `/kuvat/juomat/${filename}`;
  }

  return `/uploads/${filename}`;
}


export const getAllDrinksAdmin = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, name, image
      FROM drinks
      ORDER BY id ASC
    `);

    const drinks = rows.map(d => ({
      ...d,
      image: getDrinkImagePath(d.image)
    }));

    res.json(drinks);

  } catch (err) {
    console.error("ADMIN GET DRINKS ERROR:", err);
    res.status(500).json({ success: false });
  }
};


export const createDrink = async (req, res) => {
  try {
    const { name } = req.body;
    const file = req.file ? req.file.filename : null;

    const [result] = await db.execute(
      `INSERT INTO drinks (name, image) VALUES (?, ?)`,
      [name, file]
    );

    res.json({ success: true, id: result.insertId });

  } catch (err) {
    console.error("CREATE DRINK ERROR:", err);
    res.status(500).json({ success: false });
  }
};


export const updateDrink = async (req, res) => {
  try {
    const id = req.params.id;
    const { name } = req.body;
    const newImage = req.file ? req.file.filename : null;

    const [old] = await db.execute(
      "SELECT image FROM drinks WHERE id=?",
      [id]
    );

    if (!old.length) {
      return res.status(404).json({ success: false });
    }

    const finalImage = newImage ? newImage : old[0].image;

    await db.execute(
      `UPDATE drinks SET name=?, image=? WHERE id=?`,
      [name, finalImage, id]
    );

    res.json({ success: true });

  } catch (err) {
    console.error("UPDATE DRINK ERROR:", err);
    res.status(500).json({ success: false });
  }
};


export const deleteDrink = async (req, res) => {
  try {
    await db.execute("DELETE FROM drinks WHERE id=?", [req.params.id]);
    res.json({ success: true });

  } catch (err) {
    console.error("DELETE DRINK ERROR:", err);
    res.status(500).json({ success: false });
  }
};
