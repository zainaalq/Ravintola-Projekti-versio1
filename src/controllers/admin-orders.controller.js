import { AdminOrdersModel } from "../models/admin-orders.model.js";


export const getAllAdminOrders = async (req, res) => {
  try {
    const orders = await AdminOrdersModel.getAllOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getAdminOrderById = async (req, res) => {
  try {
    const order = await AdminOrdersModel.getOrderById(req.params.id);

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const updateAdminOrder = async (req, res) => {
  try {
    const id = req.params.id;

    const existing = await AdminOrdersModel.getOrderById(id);

    if (!existing) {
      return res.status(404).json({ error: "Order not found" });
    }

    
    const { status, keepData } = req.body;

    let updatedOrder;

    if (keepData) {
      updatedOrder = {
        customer_name: existing.customer_name,
        phone: existing.phone,
        items: existing.items,
        total_price: existing.total_price,
        status: status || existing.status,
      };
    } else {
      updatedOrder = {
        customer_name: req.body.customer_name ?? existing.customer_name,
        phone: req.body.phone ?? existing.phone,
        items: req.body.items ?? existing.items,
        total_price: req.body.total_price ?? existing.total_price,
        status: status ?? existing.status,
      };
    }

    await AdminOrdersModel.updateOrder(id, updatedOrder);

    res.json({ 
      success: true, 
      message: "Order updated successfully",
      order: updatedOrder 
    });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


export const deleteAdminOrder = async (req, res) => {
  try {
    await AdminOrdersModel.deleteOrder(req.params.id);
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
