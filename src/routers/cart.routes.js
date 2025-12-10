import express from "express";
import { getTodayDeal } from "../utils/dailyDeal.js";
const router = express.Router();

router.post("/add-deal", async (req, res) => {
  try {
    const deal = await getTodayDeal();

    if (!deal || deal.error) {
      return res.status(500).json({ error: "Deal unavailable" });
    }

    const fullPrice = deal.pizza.base_price + deal.drink.price;
    const finalPrice = fullPrice - (fullPrice * (deal.discount / 100));

    const cartItem = {
      id: `deal-${deal.date}`,
      type: "dailydeal",       
      name: "Päivän Kampanja",


      price: finalPrice,

      pizza: deal.pizza,
      drink: deal.drink,
      discount: deal.discount,
      quantity: 1
    };

    return res.json(cartItem);

  } catch (error) {
    console.error("ADD DEAL ERROR:", error);
    res.status(500).json({ error: "Cannot add deal to cart" });
  }
});

export default router;
