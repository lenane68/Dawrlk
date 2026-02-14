import { Router, Request, Response } from "express";
import { requireOwner } from "../../middlewares/requireOwner";
import { Business } from "../../models/Business";
import { AvailabilitySlot } from "../../models/AvailabilitySlot";

type AuthedRequest = Request & {
  user?: { id: string; role: string };
};

const router = Router();

router.get("/availability", requireOwner, async (req: Request, res: Response) => {
  try {
    const ownerId = (req as AuthedRequest).user?.id;
    if (!ownerId) return res.status(401).json({ message: "Unauthorized" });

    const business = await Business.findOne({ ownerId }).select("_id");
    if (!business) return res.status(404).json({ message: "Business not found" });

    const { from, to } = req.query as { from?: string; to?: string };

    const filter: any = { businessId: business._id };

    if (from || to) {
      filter.startAt = {};
      if (from) filter.startAt.$gte = new Date(from);
      if (to) filter.startAt.$lte = new Date(to);
    }

    const slots = await AvailabilitySlot.find(filter).sort({ startAt: 1 });

    res.json({ businessId: business._id, slots });
  } catch {
    res.status(500).json({ message: "Failed to fetch availability" });
  }
});

router.post("/availability", requireOwner, async (req: Request, res: Response) => {
  try {
    const ownerId = (req as AuthedRequest).user?.id;
    if (!ownerId) return res.status(401).json({ message: "Unauthorized" });

    const business = await Business.findOne({ ownerId }).select("_id");
    if (!business) return res.status(404).json({ message: "Business not found" });

    const { startAt, endAt } = req.body as { startAt: string; endAt: string };

    const start = new Date(startAt);
    const end = new Date(endAt);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      return res.status(400).json({ message: "Invalid startAt/endAt" });
    }

    const slot = await AvailabilitySlot.create({
      businessId: business._id,
      startAt: start,
      endAt: end,
      isBooked: false
    });

    res.status(201).json(slot);
  } catch (e: any) {
    if (e?.code === 11000) {
      return res.status(409).json({ message: "Slot already exists" });
    }
    res.status(500).json({ message: "Failed to create slot" });
  }
});

export default router;
