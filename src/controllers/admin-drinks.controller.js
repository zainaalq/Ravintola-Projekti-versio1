import db from "../utils/database.js";

/* =========================================================
   ADMIN - GET ALL DRINKS
   (sisältää oikean kuvapolun frontendille)
========================================================= */
export const getAllDrinksAdmin = async (req, res) => {
  const [rows] = await db.query(`
    SELECT 
      d.id,
      d.name,
      d.image,
      s1.price AS small_price,
      s2.price AS large_price
    FROM drinks d
    LEFT JOIN drink_sizes s1 ON d.id = s1.drink_id AND s1.size = 'Small'
    LEFT JOIN drink_sizes s2 ON d.id = s2.drink_id AND s2.size = 'Large'
    ORDER BY d.id DESC
  `);

  const drinks = rows.map((d) => {
    let imagePath;

    // UUSI KUVA (multer → numeroita + - merkki)
    if (d.image && (d.image[0].match(/[0-9]/) || d.image.includes("-"))) {
      imagePath = `/uploads/${d.image}`;
    } else {
      // VANHA KUVA
      imagePath = `/kuvat/juomat/${d.image}`;
    }

    return {
      ...d,
      image: imagePath
    };
  });

  res.json(drinks);
};


/* =========================================================
   ADMIN - CREATE DRINK
========================================================= */
export const createDrink = async (req, res) => {
  const { name, small_price, large_price } = req.body;
  const image = req.file ? req.file.filename : null;

  const [result] = await db.execute(
    "INSERT INTO drinks (name, image) VALUES (?, ?)",
    [name, image]
  );

  const drinkId = result.insertId;

  await db.execute(
    "INSERT INTO drink_sizes (drink_id, size, price) VALUES (?, 'Small', ?)",
    [drinkId, small_price]
  );

  await db.execute(
    "INSERT INTO drink_sizes (drink_id, size, price) VALUES (?, 'Large', ?)",
    [drinkId, large_price]
  );

  res.json({ success: true });
};


/* =========================================================
   ADMIN - UPDATE DRINK
========================================================= */
export const updateDrink = async (req, res) => {
  const { id } = req.params;
  const { name, small_price, large_price, old_image } = req.body;

  const newImage = req.file ? req.file.filename : old_image;

  await db.execute(
    "UPDATE drinks SET name = ?, image = ? WHERE id = ?",
    [name, newImage, id]
  );

  await db.execute(
    "UPDATE drink_sizes SET price = ? WHERE drink_id = ? AND size = 'Small'",
    [small_price, id]
  );

  await db.execute(
    "UPDATE drink_sizes SET price = ? WHERE drink_id = ? AND size = 'Large'",
    [large_price, id]
  );

  res.json({ success: true });
};


/* =========================================================
   ADMIN - DELETE DRINK
========================================================= */
export const deleteDrink = async (req, res) => {
  const { id } = req.params;

  await db.execute("DELETE FROM drinks WHERE id = ?", [id]);

  res.json({ success: true });
};
