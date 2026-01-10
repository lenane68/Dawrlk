import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../models/User";
import { Otp } from "../../models/Otp";

const router = Router();

const requireEnv = (k: string) => {
  const v = process.env[k];
  if (!v) throw new Error(`${k} is missing`);
  return v;
};

const genCode = () => String(Math.floor(100000 + Math.random() * 900000));

router.post("/request-otp", async (req, res) => {
  const { phone } = req.body as { phone?: string };
  if (!phone) return res.status(400).json({ message: "phone is required" });

  const code = genCode();
  const codeHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await Otp.deleteMany({ phone });
  await Otp.create({ phone, codeHash, expiresAt });

  // MVP DEV MODE: return the code so you can test without SMS
  return res.json({ success: true, devCode: code });
});

router.post("/verify-otp", async (req, res) => {
  const { phone, code, name } = req.body as { phone?: string; code?: string; name?: string };
  if (!phone || !code) return res.status(400).json({ message: "phone and code are required" });

  const otp = await Otp.findOne({ phone }).sort({ createdAt: -1 });
  if (!otp) return res.status(400).json({ message: "invalid code" });
  if (otp.expiresAt.getTime() < Date.now()) return res.status(400).json({ message: "code expired" });

  const ok = await bcrypt.compare(code, otp.codeHash);
  if (!ok) return res.status(400).json({ message: "invalid code" });

  let user = await User.findOne({ phone });
  if (!user) {
    user = await User.create({ phone, name, role: "customer" });
  } else if (name && !user.get("name")) {
    user.set("name", name);
    await user.save();
  }

  await Otp.deleteMany({ phone });

  const secret = requireEnv("JWT_SECRET");
  const token = jwt.sign(
    { userId: user._id.toString(), role: user.get("role") },
    secret,
    { expiresIn: "7d" }
  );

  return res.json({
    token,
    user: {
      _id: user._id,
      phone: user.get("phone"),
      name: user.get("name"),
      role: user.get("role")
    }
  });
});

export default router;
