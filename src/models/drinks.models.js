import promisePool from "../utils/database.js";

const listDrinksWithSizes = async () => {
  try {
    const sql = `
      SELECT 
        d.id,
        d.name,
        d.image,
        ds.id AS size_id,
        ds.size,
        ds.price
      FROM drinks d
      LEFT JOIN drink_sizes ds ON d.id = ds.drink_id
      ORDER BY d.id, ds.size;
    `;

    const [rows] = await promisePool.query(sql);

    const drinks = {};

    rows.forEach(row => {
      if (!drinks[row.id]) {
        drinks[row.id] = {
          id: row.id,
          name: row.name,
          image: row.image,
          sizes: []
        };
      }

      if (row.size) {
        drinks[row.id].sizes.push({
          id: row.size_id,
          size: row.size,
          price: row.price
        });
      }
    });

    return Object.values(drinks);
  } catch (err) {
    console.error("DB ERROR listDrinksWithSizes:", err);
    return { error: err.message };
  }
};

const findDrinkById = async (id) => {
  try {
    const sql = `
      SELECT 
        d.id,
        d.name,
        d.image,
        ds.id AS size_id,
        ds.size,
        ds.price
      FROM drinks d
      LEFT JOIN drink_sizes ds ON d.id = ds.drink_id
      WHERE d.id = ?
    `;

    const [rows] = await promisePool.query(sql, [id]);

    if (!rows.length) return null;

    const drink = {
      id: rows[0].id,
      name: rows[0].name,
      image: rows[0].image,
      sizes: []
    };

    rows.forEach(row => {
      if (row.size) {
        drink.sizes.push({
          id: row.size_id,
          size: row.size,
          price: row.price
        });
      }
    });

    return drink;
  } catch (err) {
    console.error("DB ERROR findDrinkById:", err);
    return { error: err.message };
  }
};

const addDrink = async ({ name, image }) => {
  try {
    const sql = `
      INSERT INTO drinks (name, image)
      VALUES (?, ?)
    `;

    const [result] = await promisePool.execute(sql, [name, image]);

    return { id: result.insertId };
  } catch (err) {
    console.error("DB ERROR addDrink:", err);
    return { error: err.message };
  }
};

const updateDrink = async (id, { name, image }) => {
  try {
    const sql = `
      UPDATE drinks SET name=?, image=? WHERE id=?
    `;

    const [result] = await promisePool.execute(sql, [name, image, id]);

    return { affectedRows: result.affectedRows };
  } catch (err) {
    console.error("DB ERROR updateDrink:", err);
    return { error: err.message };
  }
};

const deleteDrink = async (id) => {
  try {
    const sql = `DELETE FROM drinks WHERE id=?`;
    const [result] = await promisePool.execute(sql, [id]);
    return { affectedRows: result.affectedRows };
  } catch (err) {
    console.error("DB ERROR deleteDrink:", err);
    return { error: err.message };
  }
};

export {
  listDrinksWithSizes,
  findDrinkById,
  addDrink,
  updateDrink,
  deleteDrink
};
