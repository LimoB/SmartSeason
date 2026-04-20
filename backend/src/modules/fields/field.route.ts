import { Router } from "express";
import {
  getFields,
  getFieldById,
  createField,
  updateField,
  deleteField,
} from "./field.controller";
import { adminAuth, adminOrAgentAuth } from "@/middleware/bearAuth";

const router: Router = Router();

/* ================= FIELD ROUTES ================= */

// GET /api/fields
// Admin → all fields
// Agent → assigned fields
router.get("/", adminOrAgentAuth, getFields);

// GET /api/fields/:id
router.get("/:id", adminOrAgentAuth, getFieldById);

// POST /api/fields
// Admin only
router.post("/", adminAuth, createField);

// PUT /api/fields/:id
// Admin → full update
// Agent → limited update (enforced in controller)
router.put("/:id", adminOrAgentAuth, updateField);

// 🔥 NEW: Assign field to agent (important feature)
router.patch("/:id/assign", adminAuth, updateField);

// DELETE /api/fields/:id
// Admin only
router.delete("/:id", adminAuth, deleteField);

export default router;