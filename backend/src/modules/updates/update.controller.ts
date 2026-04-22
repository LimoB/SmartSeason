import type { Request, Response, NextFunction } from "express";
import {
  createUpdateService,
  getFieldUpdatesService,
} from "./update.service";

/* ================= TYPES ================= */
const VALID_STAGES = ["planted", "growing", "ready", "harvested"] as const;

/* ================= CREATE UPDATE ================= */
export const createUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const agentId = req.user?.userId;
    const { fieldId, stage, notes } = req.body;

    /* ================= AUTH CHECK ================= */
    if (!agentId) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    /* ================= VALIDATION ================= */
    const parsedFieldId = Number(fieldId);

    if (!parsedFieldId || isNaN(parsedFieldId)) {
      return res.status(400).json({
        success: false,
        error: "Valid Field ID is required",
      });
    }

    if (!stage || !VALID_STAGES.includes(stage)) {
      return res.status(400).json({
        success: false,
        error: `Invalid stage. Must be one of: ${VALID_STAGES.join(", ")}`,
      });
    }

    /* ================= SERVICE CALL ================= */
    const update = await createUpdateService({
      fieldId: parsedFieldId,
      agentId,
      stage,
      notes,
    });

    return res.status(201).json({
      success: true,
      message: "Field update recorded successfully",
      data: update,
    });
  } catch (error: any) {
    /* ================= BUSINESS ERRORS ================= */
    if (
      error.message === "Field not found" ||
      error.message === "Agent not found"
    ) {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    if (error.message === "Unauthorized: You are not assigned to this field") {
      return res.status(403).json({
        success: false,
        error: error.message,
      });
    }

    next(error);
  }
};

/* ================= GET FIELD UPDATES ================= */
export const getFieldUpdates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fieldId = Number(req.params.fieldId);

    if (!fieldId || isNaN(fieldId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid field ID",
      });
    }

    const updates = await getFieldUpdatesService(fieldId);

    return res.status(200).json({
      success: true,
      count: updates.length,
      data: updates,
    });
  } catch (error) {
    next(error);
  }
};