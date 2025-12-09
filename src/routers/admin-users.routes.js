import express from "express";
import { requireAdmin } from "../middleware/authAdmin.js";

import {
  getAdminUsers,
  deleteAdminUser
} from "../controllers/admin-users.controller.js";

const router = express.Router();

router.get("/", requireAdmin, getAdminUsers);
router.delete("/:id", requireAdmin, deleteAdminUser);

export default router;
