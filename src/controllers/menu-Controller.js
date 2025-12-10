import {
  listPizzasWithToppings,
  getPizzaFullConfig,
  addPizza,
  updatePizza,
  deletePizza
} from "../models/MenuItem.models.js";


function getPizzaImagePath(filename) {
  if (!filename) return null;

  const isOld = !filename.includes("-");

  if (isOld) {
    return `/kuvat/${filename}`;
  }

  return `/uploads/${filename}`;
}


const getAllPizzas = async (req, res) => {
  try {
    const pizzas = await listPizzasWithToppings();

    if (pizzas.error) {
      return res.status(500).json({ error: pizzas.error });
    }


    const fixed = pizzas.map(p => ({
      ...p,
      base_price: Number(p.base_price),
      image: getPizzaImagePath(p.image)
    }));

    res.json(fixed);
  } catch (err) {
    console.error("GET ALL PIZZAS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const getPizzaDetails = async (req, res) => {
  try {
    const id = req.params.id;

    const pizza = await getPizzaFullConfig(id);

    if (!pizza) {
      return res.status(404).json({ error: "Pizza not found" });
    }

    
    pizza.image = getPizzaImagePath(pizza.image);
    pizza.base_price = Number(pizza.base_price);

    res.json(pizza);
  } catch (err) {
    console.error("GET PIZZA DETAILS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};


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
    id: result.id
  });
};


const editPizza = async (req, res) => {
  const id = req.params.id;
  const { name, description, base_price, image } = req.body;

  const result = await updatePizza(id, {
    name,
    description,
    base_price,
    image
  });

  if (result.error) {
    return res.status(500).json({ error: result.error });
  }

  if (result.affectedRows === 0) {
    return res.status(404).json({ error: "Pizza not found" });
  }

  res.json({ message: "Pizza updated successfully" });
};


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
  removePizza
};
