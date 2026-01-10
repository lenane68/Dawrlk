import { Schema, model } from "mongoose";

const otpSchema = new Schema(
  {
    phone: { type: String, required: true, index: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true }
  },
  { timestamps: true }
);

export const Otp = model("Otp", otpSchema);