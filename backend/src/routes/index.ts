import { Router } from "express";
import authRoutes from "./auth/auth.routes";
import meRoutes from "./me/me.routes";

const router = Router();

router.get("/", (_req, res) => res.json({ ok: true }));

router.use("/auth", authRoutes);
router.use("/me", meRoutes);

export default router;
