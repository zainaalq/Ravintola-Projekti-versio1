import {
  listDrinksWithSizes,
  findDrinkById,
  addDrink,
  updateDrink,
  deleteDrink
} from "../models/drinks.models.js";

// Get all drinks
const getAllDrinks = async (req, res) => {
  const drinks = await listDrinksWithSizes();

  if (drinks.error) return res.status(500).json({ error: drinks.error });

  res.json(drinks);
};

// Get one drink
const getDrinkDetails = async (req, res) => {
  const id = req.params.id;

  const drink = await findDrinkById(id);

  if (!drink) return res.status(404).json({ error: "Drink not found" });

  res.json(drink);
};

// Add drink
const createDrink = async (req, res) => {
  const { name, image } = req.body;

  if (!name) return res.status(400).json({ error: "Name is required" });

  const result = await addDrink({ name, image });

  if (result.error) return res.status(500).json({ error: result.error });

  res.status(201).json({ message: "Drink created", id: result.id });
};

// Edit drink
const editDrink = async (req, res) => {
  const id = req.params.id;
  const { name, image } = req.body;

  const result = await updateDrink(id, { name, image });

  if (result.error) return res.status(500).json({ error: result.error });

  if (result.affectedRows === 0)
    return res.status(404).json({ error: "Drink not found" });

  res.json({ message: "Drink updated" });
};

// Delete drink
const removeDrink = async (req, res) => {
  const id = req.params.id;

  const result = await deleteDrink(id);

  if (result.error) return res.status(500).json({ error: result.error });

  if (result.affectedRows === 0)
    return res.status(404).json({ error: "Drink not found" });

  res.json({ message: "Drink deleted" });
};

export {
  getAllDrinks,
  getDrinkDetails,
  createDrink,
  editDrink,
  removeDrink
};
