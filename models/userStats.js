import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import User from "./user.js";
import { updateStatsAfterUpdateProductStatus } from "../services/user.js";
const { Schema } = mongoose;

const userStatsSchema = new Schema({
  reputation: {
    type: Number,
    default: 0,
  },
  products: {
    productsRep: {
      type: Number,
      default: 0,
    },
    accepted: {
      type: Number,
      default: 0,
    },
    rejected: {
      type: Number,
      default: 0,
    },
    in_progress: {
      type: Number,
      default: 0,
    },
  },
  meal: {
    mealRep: {
      type: Number,
      default: 0,
    },
    accepted: {
      type: Number,
      default: 0,
    },
    rejected: {
      type: Number,
      default: 0,
    },
    in_progress: {
      type: Number,
      default: 0,
    },
  },
});
userStatsSchema.set("timestamps", true);
userStatsSchema.statics.updateStatsAfterUpdateProductStatus = updateStatsAfterUpdateProductStatus;
export default mongoose.model("UserStats", userStatsSchema);
