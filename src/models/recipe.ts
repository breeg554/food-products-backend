import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import ApiError from "../utils/ApiError";

const { Schema } = mongoose;

const recipeSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 200,
  },
  image: {
    type: String,
    required: false,
  },
  servings: {
    type: Number,
    required: true,
  },
  readyInMinutes: {
    type: Number,
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },

  ingredients: [
    {
      product: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Product",
      },
      amount: {
        type: Number,
        required: true,
      },
    },
  ],
  preparation: [
    {
      step: Number,
      instruction: {
        type: String,
      },
    },
  ],
  nutrition: {
    nutrients: {
      calories: {
        amount: {
          type: Number,
          required: true,
          min: 0,
          max: 10000,
        },
        unit: { type: String, default: "kcal" },
        percentOfDailyNeeds: {
          type: Number,
          required: true,
          min: 0,
          max: 1000,
        },
      },
      protein: {
        amount: {
          type: Number,
          required: true,
          min: 0,
          max: 1000,
        },
        unit: { type: String, default: "g" },
        percentOfDailyNeeds: {
          type: Number,
          required: true,
          min: 0,
          max: 1000,
        },
      },
      fat: {
        amount: {
          type: Number,
          required: true,
          min: 0,
          max: 1000,
        },
        unit: { type: String, default: "g" },
        percentOfDailyNeeds: {
          type: Number,
          min: 0,
          max: 1000,
        },
      },
      carb: {
        amount: {
          type: Number,
          required: true,
          min: 0,
          max: 1000,
        },
        unit: { type: String, default: "g" },
        percentOfDailyNeeds: {
          type: Number,
          min: 0,
          max: 1000,
        },
      },
    },
    caloricBreakdown: {
      percentProtein: {
        type: Number,
        min: 0,
        max: 100,
      },
      percentFat: {
        type: Number,
        min: 0,
        max: 100,
      },
      percentCarbs: {
        type: Number,
        min: 0,
        max: 100,
      },
    },
  },

  category: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "RecipeCategories",
  },
  dietTypes: [
    {
      type: Schema.Types.ObjectId,
      ref: "DietType",
    },
  ],
  tags: {
    type: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  },
  rating: {
    rateCount: {
      type: Number,
      default: 0,
    },
    rateValue: {
      type: Number,
      default: 0,
    },
    rateAvg: {
      type: Number,
      default: 0,
    },
  },
  status: {
    type: String,
    enum: ["accepted", "rejected", "in_progress"],
    default: "in_progress",
  },
  _authorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

recipeSchema.plugin(mongoosePaginate);
export default mongoose.model("Recipe", recipeSchema);
