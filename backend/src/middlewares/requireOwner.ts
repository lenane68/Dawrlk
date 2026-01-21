import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { requireAuth } from "./auth";

export const requireOwner = [
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.auth!.userId);
    if (!user) return res.status(401).json({ message: "unauthorized" });

    const role = user.get("role");
    if (role !== "owner" && role !== "admin") {
      return res.status(403).json({ message: "forbidden" });
    }

    next();
  }
];
