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
    const field = await getFieldByIdService(id);

    if (!field) {
      return res.status(404).json({ error: "Field not found" });
    }

    // 🔐 Access control
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
    // 🔐 Only admin can create fields
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

    const field = await getFieldByIdService(id);
    if (!field) {
      return res.status(404).json({ error: "Field not found" });
    }

    // 🔐 Admin can update anything
    // 🔐 Agent can ONLY update their own assigned field (non-stage fields)
    if (
      req.user?.role !== "admin" &&
      field.assignedAgentId !== req.user?.userId
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    const updated = await updateFieldService(id, req.body);

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

    const field = await getFieldByIdService(id);
    if (!field) {
      return res.status(404).json({ error: "Field not found" });
    }

    // 🔐 Only admin can delete
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Only admin can delete fields" });
    }

    await deleteFieldService(id);

    return res.json({ message: "Field deleted successfully" });
  } catch (error) {
    next(error);
  }
};