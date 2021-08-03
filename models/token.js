import mongoose from "mongoose";
const { Schema } = mongoose;

const tokenSchema = new Schema({
  _userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
});
export default mongoose.model("Token", tokenSchema);
