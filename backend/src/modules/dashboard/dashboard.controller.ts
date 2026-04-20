import type { Request, Response, NextFunction } from "express";
import {
  getAdminDashboardService,
  getAgentDashboardService,
} from "./dashboard.service";

/* ================= ADMIN DASHBOARD ================= */

export const getAdminDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Explicit role check
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const data = await getAdminDashboardService();

    return res.json(data);
  } catch (error) {
    next(error);
  }
};

/* ================= AGENT DASHBOARD ================= */

export const getAgentDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    //  Explicit role enforcement
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (user.role !== "field_agent") {
      return res
        .status(403)
        .json({ error: "Field agent access required" });
    }

    const data = await getAgentDashboardService(user.userId);

    return res.json(data);
  } catch (error) {
    next(error);
  }
};