import { Router } from "express";
import { getAdminDashboard, getAgentDashboard } from "./dashboard.controller";
import { adminAuth, agentAuth } from "../../middleware/bearAuth";

const router: Router = Router();

/**
 * GET /api/dashboard/admin
 * Admin (Coordinator) overview
 */
router.get("/admin", adminAuth, getAdminDashboard);

/**
 * GET /api/dashboard/agent
 * Field Agent personalized dashboard
 */
router.get("/agent", agentAuth, getAgentDashboard);

export default router;