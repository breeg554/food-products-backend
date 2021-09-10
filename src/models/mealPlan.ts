import mongoose from "mongoose";
import MealPlanDay from "./mealPlanDay";
const { Schema } = mongoose;

const mealPlanSchema = new Schema({
  _userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  days: [
    {
      type: Schema.Types.ObjectId,
      ref: MealPlanDay,
    },
  ],
  isComplete: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

mealPlanSchema.index({ _userId: 1, startDate: 1, endDate: 1 }, { unique: true });
const MealPlan = mongoose.model("MealPlan", mealPlanSchema);

export default MealPlan;
