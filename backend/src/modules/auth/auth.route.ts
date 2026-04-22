import { Router } from "express";
import { register, login, getMe } from "./auth.controller";
import { adminOrAgentAuth } from "../../middleware/bearAuth";

const router: Router = Router();

/**
 * Public: Account creation
 */
router.post("/register", register);

/**
 * Public: Authenticate and get token
 */
router.post("/login", login);

/**
 * Protected: Get current user details from JWT
 */
router.get("/me", adminOrAgentAuth, getMe);

export default router;