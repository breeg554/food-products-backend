import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import ApiError from "../utils/ApiError";
import UserStats from "./userStats";
import User from "./user";
const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,

    minLength: 3,
    maxLength: 200,
  },

  unitOfMeasure: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "UnitOfMeasure",
  },
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

  tags: {
    type: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  },
  category: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ProductCategories",
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
productSchema.post("save", async (doc: any, next: any) => {
  try {
    const user: any = await User.findById({ _id: doc._authorId });
    if (!user.userStats) return next();

    const userStats = await UserStats.findById({ _id: user.userStats });
    if (!userStats) return next();

    userStats.products.in_progress++;
    userStats.save();

    return next();
  } catch (err: any) {
    return next(new ApiError(err.message, 500));
  }
});
productSchema.plugin(mongoosePaginate);
export default mongoose.model("Product", productSchema);
