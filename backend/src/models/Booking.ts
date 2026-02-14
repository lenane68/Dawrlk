import { Schema, model, Types } from "mongoose";

const bookingSchema = new Schema(
  {
    businessId: { type: Types.ObjectId, ref: "Business", required: true, index: true },
    customerId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    serviceId: { type: Types.ObjectId, ref: "Service", required: true },
    slotId: { type: Types.ObjectId, ref: "AvailabilitySlot", required: true, unique: true, index: true },
    price: { type: Number, required: true },
    durationMin: { type: Number, required: true },
    status: { type: String, enum: ["booked", "canceled"], default: "booked", index: true }
  },
  { timestamps: true }
);

export const Booking = model("Booking", bookingSchema);
