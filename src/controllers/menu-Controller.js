import {
  listPizzasWithToppings,
  findPizzaWithToppings,
  addPizza,
  updatePizza,
  deletePizza,
} from "../models/MenuItem.models.js";

//  GET ALL — palauttaa kaikki pizzat täytteillä
const getAllPizzas = async (req, res) => {
  const pizzas = await listPizzasWithToppings();

  if (pizzas.error) {
    return res.status(500).json({ error: pizzas.error });
  }

  res.json(pizzas);
};

//  GET ONE — palauttaa yhden pizzan täytteillä
const getPizzaDetails = async (req, res) => {
  const id = req.params.id;

  const pizza = await findPizzaWithToppings(id);

  if (!pizza) {
    return res.status(404).json({ error: "Pizza not found" });
  }

  res.json(pizza);
};

//  CREATE
const createPizza = async (req, res) => {
  const { name, description, base_price, image } = req.body;

  if (!name || !base_price) {
    return res.status(400).json({ error: "name and base_price are required" });
  }

  const result = await addPizza({ name, description, base_price, image });

  if (result.error) {
    return res.status(500).json({ error: result.error });
  }

  res.status(201).json({
    message: "Pizza created successfully",
    id: result.id,
  });
};

//  UPDATE
const editPizza = async (req, res) => {
  const id = req.params.id;
  const { name, description, base_price, image } = req.body;

  const result = await updatePizza(id, {
    name,
    description,
    base_price,
    image,
  });

  if (result.error) {
    return res.status(500).json({ error: result.error });
  }

  if (result.affectedRows === 0) {
    return res.status(404).json({ error: "Pizza not found" });
  }

  res.json({ message: "Pizza updated successfully" });
};

// DELETE
const removePizza = async (req, res) => {
  const id = req.params.id;

  const result = await deletePizza(id);

  if (result.error) {
    return res.status(500).json({ error: result.error });
  }

  if (result.affectedRows === 0) {
    return res.status(404).json({ error: "Pizza not found" });
  }

  res.json({ message: "Pizza deleted successfully" });
};

export {
  getAllPizzas,
  getPizzaDetails,
  createPizza,
  editPizza,
  removePizza,
};
