import { Schema, model, Types } from "mongoose";
import { OrderState, OrderStatus, ServiceStatus } from "./order.enums";

const ServiceSchema = new Schema(
  {
    name: { type: String, required: true },
    value: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(ServiceStatus),
      default: ServiceStatus.PENDING,
    },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    lab: { type: String, required: true },
    patient: { type: String, required: true },
    customer: { type: String, required: true },

    services: {
      type: [
        {
          name: { type: String, required: true },
          value: { type: Number, required: true },
          status: {
            type: String,
            enum: ["PENDING", "DONE"],
            default: "PENDING",
          },
        },
      ],
      required: true,
    },

    state: {
      type: String,
      enum: ["CREATED", "ANALYSIS", "COMPLETED"],
      default: "CREATED",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "DELETED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

export const Order = model("Order", OrderSchema);
