import { Schema, model } from "mongoose";

const serviceSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    category: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Service = model("Service", serviceSchema);
