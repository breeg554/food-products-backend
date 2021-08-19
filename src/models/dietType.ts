import mongoose from "mongoose";
const { Schema } = mongoose;

const dietTypeSchema = new Schema({
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
export default mongoose.model("DietType", dietTypeSchema);
