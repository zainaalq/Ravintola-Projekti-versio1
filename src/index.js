import express from "express";
import menuRoutes from "./routers/menu-Routes.js";
import drinkRoutes from "./routers/drinks-Routes.js";
import favoriteRoutes from "./routers/favorites-Routes.js";
import ordersRoutes from "./routers/orders-Routes.js";

import db from "./utils/database.js";

import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/menu", menuRoutes);
app.use("/api/drinks", drinkRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/orders", ordersRoutes);



// 🔥 LISÄTTY TILAUS-REITTI
app.post("/api/orders", async (req, res) => {
  const { customer_name, phone, items } = req.body;

  try {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "No items in order" });
    }

    let total = 0;
    items.forEach(i => total += Number(i.price) * Number(i.quantity));

    const [orderResult] = await db.execute(
      "INSERT INTO orders (customer_name, phone, total_price) VALUES (?, ?, ?)",
      [customer_name, phone, total]
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      await db.execute(
        `INSERT INTO order_items (order_id, item_name, size, price, quantity)
         VALUES (?, ?, ?, ?, ?)`,
        [
          orderId,
          item.name || "Unknown Item",
          item.size || null,
          Number(item.price),
          Number(item.quantity)
        ]
      );
    }

    res.json({ success: true, order_id: orderId });

  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ error: "Server error, could not place order." });
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
  console.log("Frontend: http://localhost:3000/1.html");
});
