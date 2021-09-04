import mongoose from "mongoose";
const { Schema } = mongoose;

const shoppingListSchema = new Schema({
  _mealPlanId: {
    type: Schema.Types.ObjectId,
    ref: "MealPlan",
  },
  _userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  date: {
    type: Date,
  },

  ingredients: [
    {
      product: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
      amount: {
        type: Number,
        required: true,
        min: 0,
        max: 100000,
      },
      bought: {
        type: Boolean,
        default: false,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  isClearRequested: {
    type: Boolean,
    default: false,
  },
});
shoppingListSchema.index({ _userId: 1, _mealPlanId: 1, date: 1 }, { unique: true });
const ShoppingList = mongoose.model("ShoppingList", shoppingListSchema);

export default ShoppingList;
