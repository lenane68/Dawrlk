import { Router, Request, Response } from "express";
import { requireOwner } from "../../middlewares/requireOwner";
import { Business } from "../../models/Business";
import { BusinessService } from "../../models/BusinessService";
import { Service } from "../../models/Service";

type AuthedRequest = Request & {
  user?: { id: string; role: string };
};

const router = Router();

router.get("/business/services", requireOwner, async (req: Request, res: Response) => {
  try {
    const ownerId = (req as AuthedRequest).user?.id;
    if (!ownerId) return res.status(401).json({ message: "Unauthorized" });

    const business = await Business.findOne({ ownerId }).select("_id");
    if (!business) return res.status(404).json({ message: "Business not found" });

    const items = await BusinessService.find({ businessId: business._id })
      .populate("serviceId");

    res.json({
      businessId: business._id,
      services: items,
    });
  } catch {
    res.status(500).json({ message: "Failed to fetch business services" });
  }
});

router.post("/business/services", requireOwner, async (req: Request, res: Response) => {
  try {
    const ownerId = (req as AuthedRequest).user?.id;
    if (!ownerId) return res.status(401).json({ message: "Unauthorized" });

    const { serviceId, durationMin, price } = req.body;

    const business = await Business.findOne({ ownerId }).select("_id");
    if (!business) return res.status(404).json({ message: "Business not found" });

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });

   await BusinessService.create({
  businessId: business._id,
  serviceId,
  durationMin,
  price,
});


    const items = await BusinessService.find({ businessId: business._id })
      .populate("serviceId");

    res.status(201).json({
      businessId: business._id,
      services: items,
    });
  } catch {
    res.status(500).json({ message: "Failed to add service to business" });
  }
});

export default router;
