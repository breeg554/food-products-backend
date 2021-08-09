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
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 84600 });
export default mongoose.model("Token", tokenSchema);
