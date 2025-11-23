import promisePool from '../utils/database.js';

// ✅ HAE KAIKKI PIZZAT
const listAllPizzas = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM menu_items');
    return rows;
  } catch (e) {
    console.error('DB ERROR (listAllPizzas):', e.message);
    return { error: e.message };
  }
};

// ✅ HAE YKSI PIZZA ID:LLÄ
const findPizzaById = async (id) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT * FROM menu_items WHERE id = ?',
      [id]
    );
    return rows[0];
  } catch (e) {
    console.error('DB ERROR (findPizzaById):', e.message);
    return { error: e.message };
  }
};

// ✅ HAE PIZZA + TÄYTTEET
const findPizzaWithToppings = async (id) => {
  try {
    const sql = `
      SELECT 
        mi.id,
        mi.name,
        mi.description,
        mi.base_price,
        mi.image,
        t.id AS topping_id,
        t.name AS topping_name,
        t.price AS topping_price,
        t.category,
        pt.is_default
      FROM menu_items mi
      LEFT JOIN pizza_toppings pt ON mi.id = pt.pizza_id
      LEFT JOIN toppings t ON pt.topping_id = t.id
      WHERE mi.id = ?
      ORDER BY pt.is_default DESC
    `;

    const [rows] = await promisePool.execute(sql, [id]);
    return rows;
  } catch (e) {
    console.error('DB ERROR (findPizzaWithToppings):', e.message);
    return { error: e.message };
  }
};

// ✅ LISÄÄ UUSI PIZZA
const addPizza = async (pizza) => {
  const { name, description, base_price, image } = pizza;

  const sql = `
    INSERT INTO menu_items (name, description, base_price, image)
    VALUES (?, ?, ?, ?)
  `;

  try {
    const [result] = await promisePool.execute(sql, [
      name,
      description,
      base_price,
      image,
    ]);
    return { id: result.insertId };
  } catch (e) {
    console.error('DB ERROR (addPizza):', e.message);
    return { error: e.message };
  }
};

// ✅ PÄIVITÄ PIZZA
const updatePizza = async (id, pizza) => {
  const { name, description, base_price, image } = pizza;

  const sql = `
    UPDATE menu_items
    SET name = ?, description = ?, base_price = ?, image = ?
    WHERE id = ?
  `;

  try {
    const [result] = await promisePool.execute(sql, [
      name,
      description,
      base_price,
      image,
      id,
    ]);

    return { affectedRows: result.affectedRows };
  } catch (e) {
    console.error('DB ERROR (updatePizza):', e.message);
    return { error: e.message };
  }
};

// ✅ POISTA PIZZA
const deletePizza = async (id) => {
  try {
    const [result] = await promisePool.execute(
      'DELETE FROM menu_items WHERE id = ?',
      [id]
    );
    return { affectedRows: result.affectedRows };
  } catch (e) {
    console.error('DB ERROR (deletePizza):', e.message);
    return { error: e.message };
  }
};

export {
  listAllPizzas,
  findPizzaById,
  findPizzaWithToppings,
  addPizza,
  updatePizza,
  deletePizza,
};
