import { Schema, model, Types } from "mongoose";

const availabilitySlotSchema = new Schema(
  {
    businessId: { type: Types.ObjectId, ref: "Business", required: true, index: true },
    startAt: { type: Date, required: true, index: true },
    endAt: { type: Date, required: true, index: true },
    isBooked: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

availabilitySlotSchema.index({ businessId: 1, startAt: 1 }, { unique: true });

export const AvailabilitySlot = model("AvailabilitySlot", availabilitySlotSchema);
