import { Router, Request, Response } from "express";
import { requireOwner } from "../../middlewares/requireOwner";
import { Business } from "../../models/Business";
import { Booking } from "../../models/Booking";

type AuthedRequest = Request & {
  user?: { id: string; role: string };
};

const router = Router();

router.get("/bookings", requireOwner, async (req: Request, res: Response) => {
  try {
    const ownerId = (req as AuthedRequest).user?.id;
    if (!ownerId) return res.status(401).json({ message: "Unauthorized" });

    const business = await Business.findOne({ ownerId }).select("_id");
    if (!business) return res.status(404).json({ message: "Business not found" });

    const items = await Booking.find({ businessId: business._id })
  .populate("serviceId")
  .populate("slotId")
  .sort({ createdAt: -1 });


    res.json({ businessId: business._id, bookings: items });
  } catch {
    res.status(500).json({ message: "Failed to fetch owner bookings" });
  }
});

export default router;
