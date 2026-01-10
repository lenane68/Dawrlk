import { Schema, model, Types } from "mongoose";

export type UserRole = "customer" | "owner" | "admin";

const userSchema = new Schema(
  {
    phone: { type: String, required: true, unique: true },
    name: { type: String },
    role: { type: String, enum: ["customer", "owner", "admin"], default: "customer" },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const User = model("User", userSchema);
