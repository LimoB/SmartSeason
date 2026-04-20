import type { Request, Response, NextFunction } from "express";
import {
  registerUserService,
  loginUserService,
  getMeService,
} from "./auth.service";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await registerUserService(req.body);
    return res.status(201).json({
      message: "Registration successful",
      user,
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await loginUserService(req.body);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(401).json({ error: error.message });
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await getMeService(userId);
    return res.json(user);
  } catch (error: any) {
    next(error);
  }
};