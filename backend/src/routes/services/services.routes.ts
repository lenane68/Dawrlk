import { Router } from "express";
import { Service } from "../../models/Service";

const router = Router();

router.get("/", async (_req, res) => {
  const services = await Service.find({ isActive: true }).sort({ name: 1 });
  res.json(
    services.map((s) => ({
      _id: s._id,
      name: s.get("name"),
      category: s.get("category")
    }))
  );
});

export default router;
