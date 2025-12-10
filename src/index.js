import express from "express";
import jwt from "jsonwebtoken";

import menuRoutes from "./routers/menu-Routes.js";
import drinkRoutes from "./routers/drinks-Routes.js";
import favoriteRoutes from "./routers/favorites-Routes.js";
import ordersRoutes from "./routers/orders-Routes.js";
import adminOrdersRouter from "./routers/admin-orders.routes.js";
import adminUsersRouter from "./routers/admin-users.routes.js";
import adminDrinksRoutes from "./routers/admin-drinks.routes.js";
import adminPizzasRoutes from "./routers/admin-pizzas.routes.js";
import dailyDealsRouter from "./routers/dailyDeals.routes.js";
import cartRoutes from "./routers/cart.routes.js";

import { requireAdmin } from "./middleware/authAdmin.js";
import db from "./utils/database.js";

import path from "path";
import { fileURLToPath } from "url";

const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || "supersecretpizza";

app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));



app.use("/kuvat/juomat", express.static(path.join(__dirname, "../public/kuvat/juomat")));

app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

app.use("/kuvat", express.static(path.join(__dirname, "../public/kuvat")));



app.use("/api/menu", menuRoutes);
app.use("/api/drinks", drinkRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/dailydeal", dailyDealsRouter);
app.use("/cart", cartRoutes);


app.use("/api/admin/orders", requireAdmin, adminOrdersRouter);
app.use("/api/admin/users", requireAdmin, adminUsersRouter);
app.use("/api/admin/drinks", requireAdmin, adminDrinksRoutes);
app.use("/api/admin/pizzas", requireAdmin, adminPizzasRoutes);

app.post("/api/admin/register", async (req, res) => {
    const { email, username, password } = req.body;

    try {
        if (!email.endsWith("@admin.com")) {
            return res.json({
                success: false,
                message: "Sähköpostin tulee päättyä @admin.com"
            });
        }

        const [exists] = await db.execute(
            "SELECT * FROM admin_users WHERE email = ? OR username = ? OR password = ?",
            [email, username, password]
        );

        if (exists.length > 0) {
            return res.json({
                success: false,
                message: "Sähköposti, käyttäjänimi tai salasana on jo käytössä!"
            });
        }

        await db.execute(
            "INSERT INTO admin_users (email, username, password) VALUES (?, ?, ?)",
            [email, username, password]
        );

        res.json({ success: true, message: "Rekisteröinti onnistui!" });

    } catch (err) {
        console.error("REGISTER ERROR:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await db.execute(
            "SELECT * FROM admin_users WHERE username = ? AND password = ?",
            [username, password]
        );

        if (!rows.length) {
            return res.json({
                success: false,
                message: "Väärä käyttäjä tai salasana"
            });
        }

        const admin = rows[0];

        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ success: true, token });

    } catch (err) {
        console.error("LOGIN ERROR:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.get("/api/admin/check", (req, res) => {
    const auth = req.headers.authorization || "";
    if (!auth.startsWith("Bearer ")) return res.json({ ok: false });

    const token = auth.slice(7);

    try {
        jwt.verify(token, JWT_SECRET);
        return res.json({ ok: true });
    } catch {
        return res.json({ ok: false });
    }
});

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
    console.log("Frontend: http://localhost:3000/1.html");
});
