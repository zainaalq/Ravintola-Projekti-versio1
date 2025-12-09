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
    // Poistetaan KAIKKI tilaukset tältä asiakkaalta
    const sql = `
      DELETE FROM orders
      WHERE customer_name = (
        SELECT customer_name FROM orders WHERE id = ?
      )
      AND phone = (
        SELECT phone FROM orders WHERE id = ?
      )
    `;

    await promisePool.execute(sql, [customer_id, customer_id]);
    return { success: true };
  }
};
