import { Router } from "express";
import authRoutes from "./auth/auth.routes";
import meRoutes from "./me/me.routes";
import servicesRoutes from "./services/services.routes";
import devRoutes from "./dev/dev.routes";
import ownerRoutes from "./owner/owner.routes";
import businessServicesRoutes from "./owner/businessServices.routes";
import availabilityRoutes from "./owner/availability.routes";
import bookingsRoutes from "./bookings/bookings.routes";
import ownerBookingsRoutes from "./owner/ownerBookings.routes";
import publicRoutes from "./public/public.routes";


const router = Router();

router.get("/", (_req, res) => res.json({ ok: true }));

router.use("/auth", authRoutes);
router.use("/me", meRoutes);
router.use("/services", servicesRoutes);
router.use("/dev", devRoutes);
router.use("/owner", ownerRoutes);
router.use("/owner", businessServicesRoutes);
router.use("/owner", availabilityRoutes);
router.use("/bookings", bookingsRoutes);
router.use("/owner", ownerBookingsRoutes);
router.use("/public", publicRoutes);


export default router;
