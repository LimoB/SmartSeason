import { Router } from "express";
import { createUpdate, getFieldUpdates } from "./update.controller";
import { agentAuth, adminOrAgentAuth } from "../../middleware/bearAuth";

const router: Router = Router();

/* ============================================================
   FIELD UPDATE ROUTES
============================================================ */

/**
 * POST /api/updates
 * Purpose: ONLY agents submit field updates
 */
router.post(
  "/",
  agentAuth, //  only field agents
  createUpdate
);

/**
 * GET /api/updates/field/:fieldId
 * Purpose: Admin + Agent can view updates
 */
router.get(
  "/field/:fieldId",
  adminOrAgentAuth, // both roles allowed
  getFieldUpdates
);

export default router;