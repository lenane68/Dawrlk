import { Router, Request, Response } from "express";
import { requireOwner } from "../../middlewares/requireOwner";
import { Business } from "../../models/Business";

type AuthedRequest = Request & {
  user?: { id: string; role: string };
};

const router = Router();

router.post("/business", requireOwner, async (req: Request, res: Response) => {
  try {
    const ownerId = (req as AuthedRequest).user?.id;
    if (!ownerId) return res.status(401).json({ message: "Unauthorized" });

    const business = await Business.create({
      ...req.body,
      ownerId,
    });

    res.status(201).json(business);
  } catch (err) {
    res.status(500).json({ message: "Failed to create business" });
  }
});

export default router;
