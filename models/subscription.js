import { model, models, Schema } from "mongoose";

const subscriptionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
});

export const Subscription =
  models?.Subscription || model("Subscription", subscriptionSchema);
