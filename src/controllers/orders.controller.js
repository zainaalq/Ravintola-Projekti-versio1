// ================================
// ORDERS CONTROLLER
// ================================
import {
  createOrder,
  addOrderItem,
  getAllOrders,
  updateOrderStatus,
  deleteOrder
} from "../models/orders.model.js";

// -------------------------------
// POST /api/orders → luo uusi tilaus
// -------------------------------
export const placeOrder = async (req, res) => {
  try {
    const { customer_name, phone, items } = req.body;

    let total = 0;
    items.forEach(i => total += i.price * i.quantity);

    const orderId = await createOrder(customer_name, phone, total);

    for (const item of items) {
      await addOrderItem(orderId, item);
    }

    res.json({ success: true, order_id: orderId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

// -------------------------------
// GET /api/orders → ADMIN: kaikki tilaukset
// -------------------------------
export const adminGetOrders = async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

// -------------------------------
// POST /api/orders/status → päivitä tilauksen tila
// -------------------------------
export const changeOrderStatus = async (req, res) => {
  try {
    const { order_id, status } = req.body;

    await updateOrderStatus(order_id, status);

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

// -------------------------------
// POST /api/orders/delete → poista tilaus
// -------------------------------
export const removeOrder = async (req, res) => {
  try {
    const { order_id } = req.body;

    await deleteOrder(order_id);

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};
