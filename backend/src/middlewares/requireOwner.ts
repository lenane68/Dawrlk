import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

type JwtPayload = {
  userId?: string;
  id?: string;
  _id?: string;
  role?: string;
};

type AnyReq = Request & {
  user?: { id: string; role: string };
};

function extractBearerToken(req: Request): string | null {
  const h = req.headers.authorization;
  if (!h) return null;
  const [type, token] = h.split(" ");
  if (type !== "Bearer" || !token) return null;
  return token.trim();
}

export async function requireOwner(req: Request, res: Response, next: NextFunction) {
  try {
    const token = extractBearerToken(req);
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ message: "JWT_SECRET missing" });

    const decoded = jwt.verify(token, secret) as JwtPayload;

    const userId = decoded.userId || decoded.id || decoded._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).select("_id role");
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    if (user.role !== "owner" && user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    (req as AnyReq).user = { id: String(user._id), role: user.role };
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
