import { Router, Request, Response } from "express";
import { requireOwner } from "../../middlewares/requireOwner";
import { Business } from "../../models/Business";
import { Service } from "../../models/Service";

type AuthedRequest = Request & {
  user?: {
    id: string;
    role: string;
  };
};

const router = Router();

function getOwnerId(req: Request): string | null {
  const r = req as AuthedRequest;
  return r.user?.id ?? null;
}

// This safely reads/writes the business services array even if the schema field name differs.
// It tries common candidates, otherwise falls back to creating "services" dynamically.
function getBusinessServicesArray(business: any): any[] {
  if (Array.isArray(business.services)) return business.services;
  if (Array.isArray(business.businessServices)) return business.businessServices;
  if (Array.isArray(business.ownerServices)) return business.ownerServices;
  if (Array.isArray(business.servicesList)) return business.servicesList;

  business.services = [];
  return business.services;
}

router.get(
  "/business/services",
  requireOwner,
  async (req: Request, res: Response) => {
    try {
      const ownerId = getOwnerId(req);
      if (!ownerId) return res.status(401).json({ message: "Unauthorized" });

      const business: any = await Business.findOne({ ownerId });

      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }

      const servicesArr = getBusinessServicesArray(business);

      res.json({
        businessId: business._id,
        services: servicesArr,
      });
    } catch (e) {
      res.status(500).json({ message: "Failed to fetch business services" });
    }
  }
);

router.post(
  "/business/services",
  requireOwner,
  async (req: Request, res: Response) => {
    try {
      const ownerId = getOwnerId(req);
      if (!ownerId) return res.status(401).json({ message: "Unauthorized" });

      const { serviceId, duration, price } = req.body as {
        serviceId: string;
        duration: number;
        price: number;
      };

      const service = await Service.findById(serviceId);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      const business: any = await Business.findOne({ ownerId });
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }

      const servicesArr = getBusinessServicesArray(business);

      servicesArr.push({
        service: service._id,
        duration,
        price,
      });

      // write back to the same field we detected
      if (Array.isArray(business.services)) business.services = servicesArr;
      else if (Array.isArray(business.businessServices)) business.businessServices = servicesArr;
      else if (Array.isArray(business.ownerServices)) business.ownerServices = servicesArr;
      else if (Array.isArray(business.servicesList)) business.servicesList = servicesArr;
      else business.services = servicesArr;

      await business.save();

      res.status(201).json({
        businessId: business._id,
        services: servicesArr,
      });
    } catch (e) {
      res.status(500).json({ message: "Failed to add service to business" });
    }
  }
);

export default router;
