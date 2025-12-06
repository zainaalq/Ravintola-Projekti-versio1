import promisePool from "../utils/database.js";

/* Muunna category UI:lle */
const mapCategory = (cat) => {
  if (cat === "base") return "base";
  if (cat === "sauce") return "sauce";
  if (cat === "cheese") return "cheese";
  return "topping";
};

/* ============================
   HAE KAIKKI PIZZAT + TÄYTTEET
============================ */
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
        toppings: [],
      };
    }

    if (row.topping_id) {
      pizzas[row.id].toppings.push({
        id: row.topping_id,
        name: row.topping_name,
        price: row.topping_price,
        category: mapCategory(row.topping_category),
        is_default: row.is_default,
      });
    }
  });

  return Object.values(pizzas);
};

/* ============================
   HAE YKSI PIZZA + TÄYTTEET
============================ */
const findPizzaWithToppings = async (id) => {
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
    WHERE mi.id = ?
    ORDER BY pt.is_default DESC
  `;

  const [rows] = await promisePool.execute(sql, [id]);

  if (!rows.length) return null;

  const pizza = {
    id: rows[0].id,
    name: rows[0].name,
    description: rows[0].description,
    base_price: rows[0].base_price,
    image: rows[0].image,
    toppings: [],
  };

  rows.forEach((row) => {
    if (row.topping_id) {
      pizza.toppings.push({
        id: row.topping_id,
        name: row.topping_name,
        price: row.topping_price,
        category: mapCategory(row.topping_category),
        is_default: row.is_default,
      });
    }
  });

  return pizza;
};

/* ============================
   HAE ILMAN TÄYTTEITÄ
============================ */
const listAllPizzas = async () => {
  const [rows] = await promisePool.query("SELECT * FROM menu_items");
  return rows;
};

const findPizzaById = async (id) => {
  const [rows] = await promisePool.execute(
    "SELECT * FROM menu_items WHERE id = ?",
    [id]
  );
  return rows[0];
};

/* ============================
   LISÄÄ UUSI PIZZA
============================= */
const addPizza = async ({ name, description, base_price, image }) => {
  const sql = `
    INSERT INTO menu_items (name, description, base_price, image)
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await promisePool.execute(sql, [
    name,
    description,
    base_price,
    image,
  ]);

  return { id: result.insertId };
};

/* ============================
   PÄIVITÄ PIZZA
============================ */
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
    id,
  ]);

  return { affectedRows: result.affectedRows };
};

/* ============================
   POISTA PIZZA
============================ */
const deletePizza = async (id) => {
  const [result] = await promisePool.execute(
    "DELETE FROM menu_items WHERE id = ?",
    [id]
  );

  return { affectedRows: result.affectedRows };
};

/* ============================
   EXPORTIT (TÄRKEÄ!!)
============================ */
export {
  listAllPizzas,
  listPizzasWithToppings,
  findPizzaById,
  findPizzaWithToppings,
  addPizza,
  updatePizza,
  deletePizza
};
