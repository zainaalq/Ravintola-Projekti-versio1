import promisePool from "../utils/database.js";

export const AdminOrdersModel = {

  // ==============================
  //  HAE KAIKKI TILAUKSET + CONFIG
  // ==============================
  async getAllOrders() {
    const sql = `
      SELECT 
        o.id,
        o.customer_name,
        o.phone,
        o.total_price,
        o.status,

        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', i.id,
            'item_name', i.item_name,
            'price', i.price,
            'quantity', i.quantity,
            'config', i.config
          )
        ) AS items

      FROM orders o
      LEFT JOIN order_items i ON o.id = i.order_id
      GROUP BY o.id
      ORDER BY o.id DESC
    `;

    const [rows] = await promisePool.query(sql);

    return rows.map(r => ({
      ...r,
      items: JSON.parse(r.items)
    }));
  },


  // ====================================
  //  HAE YKSI TILAUS (MUKAAN CONFIG)
  // ====================================
  async getOrderById(id) {
    const [[orderRows], [itemRows]] = await Promise.all([
      promisePool.query("SELECT * FROM orders WHERE id=?", [id]),
      promisePool.query(`
        SELECT id, item_name, price, quantity, config
        FROM order_items
        WHERE order_id=?
      `, [id])
    ]);

    if (!orderRows.length) return null;

    const order = orderRows[0];
    order.items = itemRows;
    return order;
  },


  // ====================================
  //  PÄIVITÄ TILAUS + CONFIG TUOTTEILLE
  // ====================================
  async updateOrder(id, data) {

    // päivitä order-taulu
    await promisePool.query(
      `
      UPDATE orders
      SET customer_name=?, phone=?, status=?, total_price=?
      WHERE id=?
      `,
      [data.customer_name, data.phone, data.status, data.total_price, id]
    );

    // poista vanhat tuotteet
    await promisePool.query("DELETE FROM order_items WHERE order_id=?", [id]);

    // lisää uudet tuotteet
    for (const item of data.items) {
      await promisePool.query(
        `
        INSERT INTO order_items (order_id, item_name, price, quantity, config)
        VALUES (?, ?, ?, ?, ?)
        `,
        [id, item.item_name, item.price, item.quantity, item.config ?? null]
      );
    }

    return true;
  },


  // ============================
  //  POISTA TILAUS
  // ============================
  async deleteOrder(id) {
    await promisePool.query("DELETE FROM order_items WHERE order_id=?", [id]);
    await promisePool.query("DELETE FROM orders WHERE id=?", [id]);
    return true;
  }
};
