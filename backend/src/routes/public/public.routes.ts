import { Router, Request, Response } from "express";
import { AvailabilitySlot } from "../../models/AvailabilitySlot";
import { BusinessService } from "../../models/BusinessService";
import { Business } from "../../models/Business";


const router = Router();

router.get("/business/:businessId/slots", async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;
    const { from, to } = req.query as { from?: string; to?: string };

    const filter: any = { businessId, isBooked: false };

    if (from || to) {
      filter.startAt = {};
      if (from) filter.startAt.$gte = new Date(from);
      if (to) filter.startAt.$lte = new Date(to);
    }

    const slots = await AvailabilitySlot.find(filter).sort({ startAt: 1 });
    res.json({ businessId, slots });
  } catch {
    res.status(500).json({ message: "Failed to fetch slots" });
  }
});

router.get("/business/:businessId/services", async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;

    const services = await BusinessService.find({ businessId, isActive: true })
      .populate("serviceId")
      .sort({ createdAt: 1 });

    res.json({ businessId, services });
  } catch {
    res.status(500).json({ message: "Failed to fetch services" });
  }
});

router.get("/businesses", async (_req: Request, res: Response) => {
  try {
    const items = await Business.find({ status: "approved" })
      .select("_id name description city address")
      .sort({ createdAt: -1 });

    res.json({ businesses: items });
  } catch {
    res.status(500).json({ message: "Failed to fetch businesses" });
  }
});


export default router;
