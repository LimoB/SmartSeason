import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "./user.controller";

import {
  adminAuth,
  adminOrAgentAuth, // Use this for shared access
} from "@/middleware/bearAuth";

const router: Router = Router();

/* ================= PUBLIC / INITIAL ================= */

// Note: If only admins should create users, change this to adminAuth
router.post("/", createUser);

/* ================= ADMIN ONLY ================= */

// Only admins can see the full list of users
router.get("/", adminAuth, getUsers);

// Only admins can delete accounts
router.delete("/:id", adminAuth, deleteUser);

/* ================= SHARED (SELF OR ADMIN) ================= */

/**
 * These routes use adminOrAgentAuth.
 * The controller logic inside getUserById and updateUser 
 * ensures that if the user isn't an admin, they can only access their own ID.
 */
router.get("/:id", adminOrAgentAuth, getUserById);

router.put("/:id", adminOrAgentAuth, updateUser);

export default router;