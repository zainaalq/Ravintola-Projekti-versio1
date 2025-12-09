import { AdminUsersModel } from "../models/admin-users.model.js";

export const getAdminUsers = async (req, res) => {
  try {
    const users = await AdminUsersModel.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteAdminUser = async (req, res) => {
  try {
    await AdminUsersModel.deleteUser(req.params.id);
    res.json({ message: "Asiakas poistettu onnistuneesti" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
