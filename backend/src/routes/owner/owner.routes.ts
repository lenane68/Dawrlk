import { Router, Request, Response } from "express";
import { requireOwner } from "../../middlewares/requireOwner";
import { Business } from "../../models/Business";

const router = Router();

router.post("/business", requireOwner, async (req: Request, res: Response) => {
  const { name, description, city, address, location } = req.body as any;
  if (!name) return res.status(400).json({ message: "name is required" });

  const exists = await Business.findOne({ ownerId: req.auth!.userId });
  if (exists) return res.status(409).json({ message: "business already exists" });

  const business = await Business.create({
    ownerId: req.auth!.userId,
    name,
    description,
    city,
    address,
    location
  });

  return res.json(business);
});

router.get("/business", requireOwner, async (req: Request, res: Response) => {
  const business = await Business.findOne({ ownerId: req.auth!.userId });
  if (!business) return res.status(404).json({ message: "business not found" });

  return res.json(business);
});

export default router;
