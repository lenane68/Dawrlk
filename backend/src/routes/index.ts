import { Router } from "express";
import authRoutes from "./auth/auth.routes";
import meRoutes from "./me/me.routes";
import servicesRoutes from "./services/services.routes";
import devRoutes from "./dev/dev.routes";
import ownerRoutes from "./owner/owner.routes";
import businessServicesRoutes from "./owner/businessServices.routes";

const router = Router();

router.get("/", (_req, res) => res.json({ ok: true }));

router.use("/auth", authRoutes);
router.use("/me", meRoutes);
router.use("/services", servicesRoutes);
router.use("/dev", devRoutes);
router.use("/owner", ownerRoutes);
router.use("/owner", businessServicesRoutes);

export default router;
