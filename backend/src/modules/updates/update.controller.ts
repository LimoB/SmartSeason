import type { Request, Response, NextFunction } from "express";
import {
  createUpdateService,
  getFieldUpdatesService,
} from "./update.service";

// ================= CREATE UPDATE =================
export const createUpdate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const agentId = req.user?.userId;
    const { fieldId, stage, notes } = req.body;

    if (!agentId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!fieldId || !stage) {
      return res.status(400).json({ error: "Field ID and Stage are required" });
    }

    // Note: In a real app, you'd check here if the agent is assigned to this field
    const update = await createUpdateService({
      fieldId: Number(fieldId),
      agentId,
      stage,
      notes,
    });

    return res.status(201).json(update);
  } catch (error) {
    next(error);
  }
};

// ================= GET FIELD UPDATES =================
export const getFieldUpdates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fieldId = Number(req.params.fieldId);

    if (isNaN(fieldId)) {
      return res.status(400).json({ error: "Invalid field ID" });
    }

    const updates = await getFieldUpdatesService(fieldId);
    return res.json(updates);
  } catch (error) {
    next(error);
  }
};