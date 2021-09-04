import mongoose from "mongoose";
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

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
const MealPlan = mongoose.model("MealPlan", mealPlanSchema);

export default MealPlan;
