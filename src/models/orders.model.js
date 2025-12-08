// ==========================
//  ORDERS MODEL
// ==========================
import db from "../utils/database.js";

// -----------------------------------------
// 1) LUO TILAUS ORDERS-TAULUUN
// -----------------------------------------
export const createOrder = async (customer_name, phone, total_price) => {
  const [result] = await db.execute(
    `INSERT INTO orders (customer_name, phone, total_price, status)
     VALUES (?, ?, ?, 'pending')`,
    [customer_name, phone, total_price]
  );

  return result.insertId; // palautetaan tilauksen ID
};


// -----------------------------------------
// 2) LISÄÄ TUOTE ORDER_ITEMS-TAULUUN
// -----------------------------------------
export const addOrderItem = async (order_id, item) => {
  await db.execute(
    `INSERT INTO order_items (order_id, item_name, size, price, quantity)
     VALUES (?, ?, ?, ?, ?)`,
    [
      order_id,
      item.name,
      item.size || null,
      item.price,
      item.quantity
    ]
  );
};


// -----------------------------------------
// 3) HAE KAIKKI TILAUKSET (ADMIN)
// -----------------------------------------
export const getAllOrders = async () => {
  const [orders] = await db.execute(`SELECT * FROM orders ORDER BY id DESC`);

  const [items] = await db.execute(`SELECT * FROM order_items`);

  // Liitetään tuotteet oikeaan tilaukseen
  const result = orders.map(order => ({
    ...order,
    items: items.filter(i => i.order_id === order.id)
  }));

  return result;
};


// -----------------------------------------
// 4) PÄIVITÄ TILAUKSEN STATUS
//    (pending → accepted → completed → cancelled)
// -----------------------------------------
export const updateOrderStatus = async (order_id, status) => {
  await db.execute(
    `UPDATE orders SET status = ? WHERE id = ?`,
    [status, order_id]
  );
};


// -----------------------------------------
// 5) POISTA TILAUS + SEN TUOTTEET
// -----------------------------------------
export const deleteOrder = async (order_id) => {
  try {
    await db.execute(`DELETE FROM order_items WHERE order_id = ?`, [order_id]);
    await db.execute(`DELETE FROM orders WHERE id = ?`, [order_id]);
    return true;
  } catch (err) {
    console.error("Delete order failed:", err);
    return false;
  }
};
