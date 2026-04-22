import { Router } from "express";
import { createUpdate, getFieldUpdates } from "./update.controller";
import { adminOrAgentAuth } from "../../middleware/bearAuth";

/**
 * Type annotation for Router is necessary for NodeNext portability
 */
const router: Router = Router();

// ================= FIELD UPDATE ROUTES =================

/**
 * POST /api/updates
 * Purpose: Allows Agents to submit field progress.
 * Logic: Updates the history log AND the main field status.
 */
router.post("/", adminOrAgentAuth, createUpdate);

/**
 * GET /api/updates/field/:fieldId
 * Purpose: Get chronological history of a specific field.
 */
router.get("/field/:fieldId", adminOrAgentAuth, getFieldUpdates);

export default router;