import { Schema, model, Types } from "mongoose";

const businessSchema = new Schema(
  {
    ownerId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
    city: { type: String },
    address: { type: String },
    location: {
      lat: Number,
      lng: Number
    },
    status: { type: String, enum: ["pending", "approved"], default: "approved" }
  },
  { timestamps: true }
);

export const Business = model("Business", businessSchema);
