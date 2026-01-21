import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { User } from "../../models/User";

const router = Router();

router.post("/make-owner", requireAuth, async (req, res) => {
  const user = await User.findById(req.auth!.userId);
  if (!user) return res.status(404).json({ message: "user not found" });

  user.set("role", "owner");
  await user.save();

  res.json({
    _id: user._id,
    phone: user.get("phone"),
    name: user.get("name"),
    role: user.get("role")
  });
});

export default router;
