import { model, models, Schema } from "mongoose";

const paymentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  amount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ["credit_card", "paypal", "stripe"],
    required: true,
  },
  transactionId: { type: String },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
});

export const Payment = models?.Payment || model("Payment", paymentSchema);
