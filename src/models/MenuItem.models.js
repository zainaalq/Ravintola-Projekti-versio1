import promisePool from "../utils/database.js";


const listPizzasWithToppings = async () => {
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
      t.category AS topping_category,
      pt.is_default
    FROM menu_items mi
    LEFT JOIN pizza_toppings pt ON mi.id = pt.pizza_id
    LEFT JOIN toppings t ON pt.topping_id = t.id
    ORDER BY mi.id, pt.is_default DESC
  `;

  const [rows] = await promisePool.query(sql);
  const pizzas = {};

  rows.forEach((row) => {
    if (!pizzas[row.id]) {
      pizzas[row.id] = {
        id: row.id,
        name: row.name,
        description: row.description,
        base_price: row.base_price,
        image: row.image,
        toppings: []
      };
    }

    if (row.topping_id) {
      pizzas[row.id].toppings.push({
        id: row.topping_id,
        name: row.topping_name,
        price: row.topping_price,
        category: row.topping_category,
        is_default: row.is_default
      });
    }
  });

  return Object.values(pizzas);
};


const findPizzaById = async (id) => {
  const [rows] = await promisePool.execute(
    "SELECT * FROM menu_items WHERE id = ?",
    [id]
  );
  return rows[0];
};


const getPizzaFullConfig = async (id) => {
  try {
    const [pizzaRows] = await promisePool.execute(
      "SELECT * FROM menu_items WHERE id = ?",
      [id]
    );

    if (!pizzaRows.length) return null;
    const pizza = pizzaRows[0];

    const [defaultRows] = await promisePool.execute(
      `
      SELECT t.id, t.name, t.price, t.category
      FROM pizza_toppings pt
      JOIN toppings t ON pt.topping_id = t.id
      WHERE pt.pizza_id = ?
      `,
      [id]
    );

    const [allToppings] = await promisePool.query(
      "SELECT id, name, price, category FROM toppings ORDER BY category, name"
    );

    const defaults = {
      base: defaultRows.filter(t => t.category === "base"),
      sauce: defaultRows.filter(t => t.category === "sauce"),
      cheese: defaultRows.filter(t => t.category === "cheese"),
      topping: defaultRows.filter(t => t.category === "topping")
    };

    const options = {
      base: allToppings.filter(t => t.category === "base"),
      sauce: allToppings.filter(t => t.category === "sauce"),
      cheese: allToppings.filter(t => t.category === "cheese"),
      topping: allToppings.filter(t => t.category === "topping")
    };

    return {
      id: pizza.id,
      name: pizza.name,
      description: pizza.description,
      base_price: pizza.base_price,
      image: pizza.image,
      defaults,
      options
    };

  } catch (err) {
    console.error("DB ERROR (getPizzaFullConfig):", err);
    return { error: err.message };
  }
};


const addPizza = async ({ name, description, base_price, image }) => {
  const sql = `
    INSERT INTO menu_items (name, description, base_price, image)
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await promisePool.execute(sql, [
    name,
    description,
    base_price,
    image
  ]);

  return { id: result.insertId };
};


const updatePizza = async (id, pizza) => {
  const { name, description, base_price, image } = pizza;

  const sql = `
    UPDATE menu_items
    SET name=?, description=?, base_price=?, image=?
    WHERE id=?
  `;

  const [result] = await promisePool.execute(sql, [
    name,
    description,
    base_price,
    image,
    id
  ]);

  return { affectedRows: result.affectedRows };
};


const deletePizza = async (id) => {
  const [result] = await promisePool.execute(
    "DELETE FROM menu_items WHERE id = ?",
    [id]
  );
  return { affectedRows: result.affectedRows };
};


export {
  listPizzasWithToppings,
  findPizzaById,
  getPizzaFullConfig, 
  addPizza,
  updatePizza,
  deletePizza
};
