import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import User from "./user";

const { Schema } = mongoose;

const userPreferenceSchema = new Schema(
  {
    alreadyAsked: {
      type: Boolean,
      default: false,
    },
    isTurnOn: {
      type: Boolean,
      default: true,
    },
    diet: {
      notLike: [{ type: Schema.Types.ObjectId, ref: "DietType" }],
    },
    categories: {
      notLike: [{ type: Schema.Types.ObjectId, ref: "RecipeCategories" }],
    },
  },
  { timestamps: true }
);

export default mongoose.model("UserPreference", userPreferenceSchema);
