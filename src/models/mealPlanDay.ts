import mongoose from "mongoose";
const { Schema } = mongoose;

const mealPlanDaySchema = new Schema({
  //   _mealPlanId: {
  //     type: Schema.Types.ObjectId,
  //     required: true,
  //     ref: "MealPlan",
  //   },
  _userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  dayNumber: { type: Number, min: 1, max: 7 },
  date: Date,
  meals: [
    {
      recipe: { type: Schema.Types.ObjectId, ref: "Recipe" },
      mealNumber: {
        type: Number,
        min: 1,
        max: 9,
      },
      servings: {
        type: Number,
        min: 1,
        max: 9,
      },
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

export default mongoose.model("MealPlanDay", mealPlanDaySchema);
