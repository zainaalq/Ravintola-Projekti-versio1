import promisePool from "../utils/database.js";

export const AdminUsersModel = {

  
  getAllUsers: async () => {
    const sql = `
      SELECT
        MIN(id) AS customer_id,
        customer_name AS name,
        phone,
        MIN(created_at) AS first_order
      FROM orders
      GROUP BY customer_name, phone
      ORDER BY first_order DESC
    `;

    const [rows] = await promisePool.query(sql);
    return rows;
  },

  
  deleteUser: async (customer_id) => {

    const [userRows] = await promisePool.query(
      `SELECT customer_name, phone 
       FROM orders 
       WHERE id = ? 
       LIMIT 1`,
      [customer_id]
    );

    if (userRows.length === 0) {
      return { success: false, message: "Asiakasta ei löytynyt" };
    }

    const { customer_name, phone } = userRows[0];

    await promisePool.execute(
      `DELETE FROM order_items 
       WHERE order_id IN (
         SELECT id FROM orders 
         WHERE customer_name = ? AND phone = ?
       )`,
      [customer_name, phone]
    );

    await promisePool.execute(
      `DELETE FROM orders 
       WHERE customer_name = ? AND phone = ?`,
      [customer_name, phone]
    );

    return { success: true };
  }

};
