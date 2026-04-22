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
  adminOrAgentAuth,
} from "../../middleware/bearAuth";

const router: Router = Router();

/* ================= MANAGEMENT (ADMIN ONLY) ================= */

/**
 * GET /api/users
 * Admins see everyone. Agents get 403 (Handled by middleware).
 */
router.get("/", adminAuth, getUsers);

/**
 * POST /api/users
 * Usually, admins create accounts for new agents.
 */
router.post("/", adminAuth, createUser);

/**
 * DELETE /api/users/:id
 * Only admins can remove accounts from the system.
 */
router.delete("/:id", adminAuth, deleteUser);


/* ================= PROFILE (ADMIN OR SELF) ================= */

/**
 * GET /api/users/:id
 * Logic in controller: 
 * - If Admin: Can see any :id
 * - If Agent: Can ONLY see :id if it matches their own ID.
 */
router.get("/:id", adminOrAgentAuth, getUserById);

/**
 * PUT /api/users/:id
 * Logic in controller:
 * - If Admin: Can update anything.
 * - If Agent: Can only update self (Role update is blocked in controller).
 */
router.put("/:id", adminOrAgentAuth, updateUser);

export default router;