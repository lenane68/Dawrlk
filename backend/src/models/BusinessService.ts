import { Schema, model, Types } from "mongoose";

const businessServiceSchema = new Schema(
  {
    businessId: { type: Types.ObjectId, ref: "Business", required: true, index: true },
    serviceId: { type: Types.ObjectId, ref: "Service", required: true, index: true },
    price: { type: Number, required: true },
    durationMin: { type: Number, required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

businessServiceSchema.index({ businessId: 1, serviceId: 1 }, { unique: true });

export const BusinessService = model("BusinessService", businessServiceSchema);
