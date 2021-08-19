import mongoose from "mongoose";
const { Schema } = mongoose;

const ratingSchema = new Schema({
  _recipeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Recipe",
  },
  _userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  rating: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
const Rating = mongoose.model("Rating", ratingSchema);
Rating.createIndexes({ _userId: 1, _recipeId: 1 });

export default Rating;
