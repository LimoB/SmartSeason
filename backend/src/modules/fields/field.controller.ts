import type { Request, Response, NextFunction } from "express";
import {
  getFieldsService,
  getFieldsByAgentService,
  getFieldByIdService,
  createFieldService,
  updateFieldService,
  deleteFieldService,
} from "./field.service";

/* ================= GET ALL FIELDS ================= */

export const getFields = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    const data =
      user?.role === "admin"
        ? await getFieldsService()
        : await getFieldsByAgentService(user!.userId);

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
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid field ID" });
    }

    const field = await getFieldByIdService(id);

    if (!field) {
      return res.status(404).json({ error: "Field not found" });
    }

    // Access control
    if (
      req.user?.role !== "admin" &&
      field.assignedAgentId !== req.user?.userId
    ) {
      return res.status(403).json({ error: "Access denied to this field" });
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
    if (req.user?.role !== "admin") {
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
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid field ID" });
    }

    const field = await getFieldByIdService(id);

    if (!field) {
      return res.status(404).json({ error: "Field not found" });
    }

    // Admin full access
    const isAdmin = req.user?.role === "admin";

    // Agent can only update assigned fields
    const isOwner =
      field.assignedAgentId === req.user?.userId;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Access denied" });
    }

    /**
     * IMPORTANT:
     * Stage updates are blocked in service layer
     * so we ensure clean payload here
     */
    const { currentStage, ...safeBody } = req.body;

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
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid field ID" });
    }

    const field = await getFieldByIdService(id);

    if (!field) {
      return res.status(404).json({ error: "Field not found" });
    }

    if (req.user?.role !== "admin") {
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