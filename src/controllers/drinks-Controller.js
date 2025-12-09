import db from "../utils/database.js";

/* ============================================================================
   GET ALL DRINKS (Frontend)
   Palauttaa oikean kuvan polun riippuen siitä onko kuva vanha vai uusi
============================================================================ */
export const getAllDrinks = async (req, res) => {
  const [rows] = await db.query(`
    SELECT d.id, d.name, d.image,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'id', s.id,
          'size', s.size,
          'price', s.price
        )
      ) AS sizes
    FROM drinks d
    LEFT JOIN drink_sizes s ON d.id = s.drink_id
    GROUP BY d.id
  `);

  const drinks = rows.map((d) => {
    let imagePath;

    // 🔥 Jos tiedostonimi alkaa numerolla tai sisältää "-" → multerin uusi kuva
    if (d.image && (d.image[0].match(/[0-9]/) || d.image.includes("-"))) {
      imagePath = `/uploads/${d.image}`;
    } else {
      // 🔥 Vanha kuva, joka on public/kuvat/juomat/ kansiossa
      imagePath = `/kuvat/juomat/${d.image}`;
    }

    return {
      id: d.id,
      name: d.name,
      image: imagePath,
      sizes: JSON.parse(d.sizes)
    };
  });

  res.json(drinks);
};


/* ============================================================================
   GET ONE DRINK
============================================================================ */
export const getDrinkDetails = async (req, res) => {
  const id = req.params.id;

  const [rows] = await db.execute(
    "SELECT * FROM drinks WHERE id = ?",
    [id]
  );

  if (!rows.length)
    return res.status(404).json({ error: "Drink not found" });

  const drink = rows[0];

  // Sama polkulogiikka kuin ylhäällä
  if (drink.image && (drink.image[0].match(/[0-9]/) || drink.image.includes("-"))) {
    drink.image = `/uploads/${drink.image}`;
  } else {
    drink.image = `/kuvat/juomat/${drink.image}`;
  }

  res.json(drink);
};


/* ============================================================================
   CREATE NEW DRINK (Admin)
============================================================================ */
export const createDrink = async (req, res) => {
  const { name, small_price, large_price } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!name)
    return res.status(400).json({ error: "Name is required" });

  // INSERT drink
  const [result] = await db.execute(
    "INSERT INTO drinks (name, image) VALUES (?, ?)",
    [name, image]
  );

  const drinkId = result.insertId;

  // INSERT sizes
  await db.execute(
    "INSERT INTO drink_sizes (drink_id, size, price) VALUES (?, 'Small', ?)",
    [drinkId, small_price]
  );

  await db.execute(
    "INSERT INTO drink_sizes (drink_id, size, price) VALUES (?, 'Large', ?)",
    [drinkId, large_price]
  );

  res.json({ success: true, id: drinkId });
};


/* ============================================================================
   UPDATE DRINK (Admin)
============================================================================ */
export const editDrink = async (req, res) => {
  const id = req.params.id;
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


/* ============================================================================
   DELETE DRINK
============================================================================ */
export const removeDrink = async (req, res) => {
  const id = req.params.id;

  const [result] = await db.execute(
    "DELETE FROM drinks WHERE id = ?",
    [id]
  );

  if (result.affectedRows === 0)
    return res.status(404).json({ error: "Drink not found" });

  res.json({ success: true });
};
