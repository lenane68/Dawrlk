import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Booking } from "../../models/Booking";
import { AvailabilitySlot } from "../../models/AvailabilitySlot";
import { BusinessService } from "../../models/BusinessService";

type JwtPayload = { userId?: string; id?: string; _id?: string };

function getUserId(req: Request): string | null {
  const h = req.headers.authorization;
  if (!h) return null;
  const [t, token] = h.split(" ");
  if (t !== "Bearer" || !token) return null;

  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  const decoded = jwt.verify(token, secret) as JwtPayload;
  return decoded.userId || decoded.id || decoded._id || null;
}

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const customerId = getUserId(req);
    if (!customerId) return res.status(401).json({ message: "Unauthorized" });

    const { businessId, slotId, serviceId } = req.body as {
      businessId: string;
      slotId: string;
      serviceId: string;
    };

    const slot = await AvailabilitySlot.findOne({ _id: slotId, businessId });
    if (!slot) return res.status(404).json({ message: "Slot not found" });
    if (slot.isBooked) return res.status(409).json({ message: "Slot already booked" });

    const bs = await BusinessService.findOne({ businessId, serviceId, isActive: true });
    if (!bs) return res.status(404).json({ message: "Service not available for this business" });

    const booking = await Booking.create({
      businessId,
      customerId,
      serviceId,
      slotId,
      price: bs.price,
      durationMin: bs.durationMin,
      status: "booked"
    });

    slot.isBooked = true;
    await slot.save();

    res.status(201).json(booking);
  } catch (e: any) {
    if (e?.code === 11000) return res.status(409).json({ message: "Slot already booked" });
    res.status(500).json({ message: "Failed to create booking" });
  }
});

router.get("/my", async (req: Request, res: Response) => {
  try {
    const customerId = getUserId(req);
    if (!customerId) return res.status(401).json({ message: "Unauthorized" });

    const items = await Booking.find({ customerId })
  .populate("serviceId")
  .populate("slotId")
  .sort({ createdAt: -1 });


    res.json({ bookings: items });
  } catch {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

router.patch("/:id/cancel", async (req: Request, res: Response) => {
  try {
    const customerId = getUserId(req);
    if (!customerId) return res.status(401).json({ message: "Unauthorized" });

    const bookingId = req.params.id;

    const booking = await Booking.findOne({ _id: bookingId, customerId });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.status === "canceled") {
      return res.status(400).json({ message: "Already canceled" });
    }

    const slot = await AvailabilitySlot.findById(booking.slotId);
    if (!slot) return res.status(404).json({ message: "Slot not found" });

    const diffMs = slot.startAt.getTime() - Date.now();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 2) {
      return res.status(403).json({ message: "Cancellation not allowed within 2 hours" });
    }

    booking.status = "canceled";
    await booking.save();

    slot.isBooked = false;
    await slot.save();

    res.json({ message: "Booking canceled" });
  } catch {
    res.status(500).json({ message: "Failed to cancel booking" });
  }
});

export default router;
