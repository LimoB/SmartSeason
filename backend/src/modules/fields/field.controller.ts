import type { Request, Response, NextFunction } from "express";
import {
  getFieldsService,
  getFieldsByAgentService,
  getFieldByIdService,
  createFieldService,
  updateFieldService,
  deleteFieldService,
} from "./field.service";
import type { DecodedToken } from "@/middleware/bearAuth";

/* ================= TYPE GUARD ================= */

const ensureAuth = (
  req: Request,
  res: Response
): req is Request & { user: DecodedToken } => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
};

/* ================= GET ALL FIELDS ================= */

export const getFields = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!ensureAuth(req, res)) return;

    const data =
      req.user.role === "admin"
        ? await getFieldsService()
        : await getFieldsByAgentService(req.user.userId);

    return res.json(data);
  } catch (error) {
    next(error);
  }
};

/* ================= GET FIELD BY ID ================= */

export const getFieldById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!ensureAuth(req, res)) return;

    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid field ID" });
    }

    const field = await getFieldByIdService(id);

    if (!field) {
      return res.status(404).json({ error: "Field not found" });
    }

    const isAdmin = req.user.role === "admin";
    const isOwner = field.assignedAgentId === req.user.userId;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Access denied" });
    }

    return res.json(field);
  } catch (error) {
    next(error);
  }
};

/* ================= CREATE FIELD ================= */

export const createField = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!ensureAuth(req, res)) return;

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admin can create fields" });
    }

    const field = await createFieldService(req.body);

    return res.status(201).json(field);
  } catch (error) {
    next(error);
  }
};

/* ================= UPDATE FIELD ================= */

export const updateField = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!ensureAuth(req, res)) return;

    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid field ID" });
    }

    const field = await getFieldByIdService(id);

    if (!field) {
      return res.status(404).json({ error: "Field not found" });
    }

    const isAdmin = req.user.role === "admin";
    const isOwner = field.assignedAgentId === req.user.userId;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Access denied" });
    }

    let safeBody = { ...req.body };

    if (!isAdmin) {
      delete safeBody.assignedAgentId;
      delete safeBody.currentStage;
    }

    const updated = await updateFieldService(id, safeBody);

    return res.json(updated);
  } catch (error) {
    next(error);
  }
};

/* ================= DELETE FIELD ================= */

export const deleteField = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!ensureAuth(req, res)) return;

    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid field ID" });
    }

    const field = await getFieldByIdService(id);

    if (!field) {
      return res.status(404).json({ error: "Field not found" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admin can delete fields" });
    }

    await deleteFieldService(id);

    return res.json({
      success: true,
      message: "Field deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};