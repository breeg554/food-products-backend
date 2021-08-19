import mongoose from "mongoose";
const { Schema } = mongoose;

const unitOfMeasure = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minLength: 1,
    maxLength: 20,
  },
  isActiveForProducts: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
export default mongoose.model("UnitOfMeasure", unitOfMeasure);
