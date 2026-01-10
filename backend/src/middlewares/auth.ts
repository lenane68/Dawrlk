import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type JwtPayload = {
  userId: string;
  role: "customer" | "owner" | "admin";
};

declare global {
  namespace Express {
    interface Request {
      auth?: JwtPayload;
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ message: "unauthorized" });

  const token = header.slice("Bearer ".length);
  const secret = process.env.JWT_SECRET;
  if (!secret) return res.status(500).json({ message: "JWT_SECRET missing" });

  try {
    const payload = jwt.verify(token, secret) as JwtPayload;
    req.auth = payload;
    next();
  } catch {
    return res.status(401).json({ message: "invalid token" });
  }
};
