import db from "../utils/database.js";

export async function getAllUsers(req, res) {
  try {
    const [rows] = await db.execute(`
      SELECT 
        MIN(id) AS customer_id,
        customer_name AS name,
        phone,
        MIN(created_at) AS first_order
      FROM orders
      GROUP BY customer_name, phone
      ORDER BY first_order DESC
    `);

    res.json(rows);

  } catch (err) {
    console.error("GET USERS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function deleteUser(req, res) {
  try {
    const id = req.params.id;

    await db.execute("DELETE FROM orders WHERE id = ?", [id]);

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    res.status(500).json({ error: "Delete failed" });
  }
}
