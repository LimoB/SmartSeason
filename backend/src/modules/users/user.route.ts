import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "./user.controller.js";

import {
  adminAuth,
  agentAuth,
} from "@/middleware/bearAuth";

const router: Router = Router();

/* ================= PUBLIC ================= */

// Registration (you should ideally restrict role inside controller/service)
router.post("/", createUser);

/* ================= ADMIN ONLY ================= */

router.get("/", adminAuth, getUsers);

router.delete("/:id", adminAuth, deleteUser);

/* ================= USER SELF / ADMIN ================= */

// Admin or self (handled in controller, but middleware tightened)
router.get("/:id", agentAuth, getUserById);

router.put("/:id", agentAuth, updateUser);

export default router;