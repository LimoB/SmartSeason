import type { Request, Response, NextFunction } from "express";
import {
  getUsersService,
  getUserByIdService,
  createUserService,
  updateUserService,
  deleteUserService,
} from "./user.service";

/* ================= GET ALL USERS (ADMIN ONLY) ================= */
/**
 * Note: Agents should never call this. 
 * The frontend Fields.tsx now skips this call for agents to avoid 403.
 */
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Access denied: Admins only" });
    }

    const users = await getUsersService();
    return res.json(users);
  } catch (error) {
    next(error);
  }
};

/* ================= GET USER BY ID ================= */
/**
 * Purpose: Allows Admin to see anyone, and Agents to see ONLY themselves.
 */
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const targetId = Number(req.params.id);
    if (isNaN(targetId)) return res.status(400).json({ error: "Invalid User ID" });

    const currentUser = req.user;
    // Normalize the ID from middleware (handling both id and userId variants)
    const currentUserId = Number(currentUser?.userId || currentUser?.id);

    // 1. Fetch the user
    const user = await getUserByIdService(targetId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // 2. Permission Check: Is Admin? OR Is this the user fetching their own data?
    const isAdmin = currentUser?.role === "admin";
    const isSelf = currentUserId === targetId;

    if (!isAdmin && !isSelf) {
      return res.status(403).json({ error: "Forbidden: You can only view your own profile" });
    }

    return res.json(user);
  } catch (error) {
    next(error);
  }
};

/* ================= CREATE USER (ADMIN/PUBLIC) ================= */
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // If you want to restrict who can create users (e.g., only Admin creates Agents)
    // You would add a check here. Otherwise, it's a public register.
    const user = await createUserService(req.body);
    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

/* ================= UPDATE USER ================= */
/**
 * Purpose: Admin can update anyone. Agent can update self (but not their own role).
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const targetId = Number(req.params.id);
    if (isNaN(targetId)) return res.status(400).json({ error: "Invalid User ID" });

    const currentUser = req.user;
    const currentUserId = Number(currentUser?.userId || currentUser?.id);

    const isAdmin = currentUser?.role === "admin";
    const isSelf = currentUserId === targetId;

    // Security: Stop unauthorized updates
    if (!isAdmin && !isSelf) {
      return res.status(403).json({ error: "Forbidden: Cannot update this profile" });
    }

    const updateData = { ...req.body };

    // Security: Only Admin can change a user's role
    if (!isAdmin) {
      delete updateData.role;
    }

    const updated = await updateUserService(targetId, updateData);
    if (!updated) return res.status(404).json({ error: "User not found" });

    return res.json(updated);
  } catch (error) {
    next(error);
  }
};

/* ================= DELETE USER (ADMIN ONLY) ================= */
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Only admins can delete accounts" });
    }

    const deleted = await deleteUserService(id);
    if (!deleted) return res.status(404).json({ error: "User not found" });

    return res.json({ message: "User account deleted successfully" });
  } catch (error) {
    next(error);
  }
};