import express from "express";
import { getTodayDeal } from "../utils/dailyDeal.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const deal = await getTodayDeal();
    res.json(deal);
  } catch (err) {
    console.error("DailyDeal error:", err);
    res.status(500).json({ error: "Failed to generate daily deal" });
  }
});

export default router;
