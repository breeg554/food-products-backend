import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    _recipeId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Recipe",
    },
    _authorId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    _parentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comment: {
      type: String,
      maxLength: 2000,
      minLength: 1,
      required: true,
    },
    subCommentsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

commentSchema.plugin(mongoosePaginate);
const Comment = mongoose.model("Comment", commentSchema);
Comment.createIndexes({ _userId: 1, _recipeId: 1, _parentId: 1 });

export default Comment;
