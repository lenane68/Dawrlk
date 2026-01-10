import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { User } from "../../models/User";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const userId = req.auth!.userId;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "user not found" });

  res.json({
    _id: user._id,
    phone: user.get("phone"),
    name: user.get("name"),
    role: user.get("role")
  });
});

export default router;
