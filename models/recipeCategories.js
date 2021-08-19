import mongoose from "mongoose";
const { Schema } = mongoose;

const recipeCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
    maxLength: 150,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
export default mongoose.model("RecipeCategories", recipeCategorySchema);
