import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  surname: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  initials: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 10,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    minLength: 5,
    maxLength: 200,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 4,
    maxLength: 60,
  },
  password: {
    type: String,
    required: true,
  },
  userStats: {
    type: Schema.Types.ObjectId,
    ref: "UserStats",
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  // stats: {
  //   reputation: {
  //     type: Number,
  //     default: 0
  //   },

  // }
});
userSchema.set("timestamps", true);
userSchema.plugin(mongoosePaginate);
export default mongoose.model("User", userSchema);
