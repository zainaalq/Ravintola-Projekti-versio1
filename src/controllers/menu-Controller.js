import {
  listPizzasWithToppings,
  findPizzaWithToppings,
  addPizza,
  updatePizza,
  deletePizza
} from "../models/MenuItem.models.js";

/* ----------------------------------------------------------
   🔥 GET ALL PIZZAS (LYHYT VERSIO LISTALLE)
---------------------------------------------------------- */
const getAllPizzas = async (req, res) => {
  try {
    const pizzas = await listPizzasWithToppings();
    res.json(pizzas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ----------------------------------------------------------
   🔥 GET ONE PIZZA (KOTIPIZZA-EDITORILLE)
---------------------------------------------------------- */
const getPizzaDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const pizza = await findPizzaWithToppings(id);

    if (!pizza) return res.status(404).json({ error: "Pizza not found" });

    res.json(pizza);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ----------------------------------------------------------
   🔥 ADMIN: CREATE PIZZA
---------------------------------------------------------- */
const createPizza = async (req, res) => {
  try {
    const { name, description, base_price, image } = req.body;

    if (!name || !base_price) {
      return res.status(400).json({ error: "name and base_price are required" });
    }

    const result = await addPizza({ name, description, base_price, image });

    res.status(201).json({
      message: "Pizza created successfully",
      id: result.id
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ----------------------------------------------------------
   🔥 ADMIN: UPDATE PIZZA
---------------------------------------------------------- */
const editPizza = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description, base_price, image } = req.body;

    const result = await updatePizza(id, {
      name,
      description,
      base_price,
      image
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Pizza not found" });
    }

    res.json({ message: "Pizza updated successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ----------------------------------------------------------
   🔥 ADMIN: DELETE PIZZA
---------------------------------------------------------- */
const removePizza = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await deletePizza(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Pizza not found" });
    }

    res.json({ message: "Pizza deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ----------------------------------------------------------
   EXPORTIT (TÄRKEÄ!!)
---------------------------------------------------------- */
export {
  getAllPizzas,
  getPizzaDetails,
  createPizza,
  editPizza,
  removePizza
};
