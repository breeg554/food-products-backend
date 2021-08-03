import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
    maxLength: 200,
  },

  nutrition: {
    totalWeight: {
      amount: {
        type: Number,
        required: true,
        min: 0,
        max: 1000000,
      },
      unit: {
        type: String,
        default: "g",
      },
    },
    nutrients: {
      calories: {
        amount: {
          type: Number,
          required: true,
          min: 0,
          max: 10000,
        },
        unit: { type: String, default: "cal" },
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
    type: [String],
  },
  category: {
    type: String,
    required: true,
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
productSchema.plugin(mongoosePaginate);
export default mongoose.model("Product", productSchema);
