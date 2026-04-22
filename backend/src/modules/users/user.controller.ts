import type { Request, Response, NextFunction } from "express";
import {
  getUsersService,
  getUserByIdService,
  createUserService,
  updateUserService,
  deleteUserService,
} from "./user.service";

/* ================= GET ALL USERS ================= */

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 🔐 Only admin should access all users
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const users = await getUsersService();
    return res.json(users);
  } catch (error) {
    next(error);
  }
};

/* ================= GET USER BY ID ================= */

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    const currentUser = req.user;
    const user = await getUserByIdService(id);
    
    if (!user) return res.status(404).json({ error: "User not found" });

    // FIX: Ensure you are using the correct property name (id vs userId)
    // Check your auth middleware to see which one you actually use!
    const currentUserId = currentUser?.userId || currentUser?.id; 

    if (currentUser?.role !== "admin" && currentUserId !== id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    return res.json(user);
  } catch (error) {
    next(error);
  }
};

/* ================= CREATE USER ================= */

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await createUserService(req.body);
    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

/* ================= UPDATE USER ================= */

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const targetId = Number(req.params.id);
    const currentUser = req.user;
    
    // FIX: Fallback to .id if .userId is missing
    const currentUserId = currentUser?.userId || currentUser?.id;

    if (isNaN(targetId)) return res.status(400).json({ error: "Invalid ID" });

    const isAdmin = currentUser?.role === "admin";
    const isSelf = currentUserId === targetId;

    if (!isAdmin && !isSelf) {
      return res.status(403).json({ error: "Forbidden: You cannot update this profile" });
    }

    const updateData = { ...req.body };
    if (!isAdmin && "role" in updateData) delete updateData.role;

    const updated = await updateUserService(targetId, updateData);
    if (!updated) return res.status(404).json({ error: "User not found" });

    return res.json(updated);
  } catch (error) {
    next(error);
  }
};

/* ================= DELETE USER ================= */

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    // 🔐 Only admin can delete users
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const deleted = await deleteUserService(id);

    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};