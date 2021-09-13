import { Request, Response, NextFunction } from "express";
import Recipe from "../models/recipe";
import Comment from "../models/comment";
import { RatingType, RecipeType, CommentType } from "../types";
import Rating from "../models/rating";
import ApiError from "../utils/ApiError";

export const create = (req: Request, res: Response, next: NextFunction) => {
  const { _recipeId, _parentId, comment } = req.body;
  const { user } = req;
  if (!_recipeId || !comment) return next(new ApiError("Enter the required data", 400));

  const newComment = new Comment({
    _recipeId,
    _parentId: _parentId || null,
    comment,
    _authorId: user._id,
  });

  newComment.save((err: any, comment: CommentType) => {
    if (err || !comment) return next(new ApiError(err.message, 500));
    if (_parentId) {
      //@ts-ignore
      Comment.updateOne({ _id: _parentId }, { $inc: { subCommentsCount: 1 } }).exec((err, updated) => {
        if (err) {
          Comment.findByIdAndDelete({ _id: comment._id });
          return next(new ApiError(err.message, 500));
        } else res.status(201).json(comment);
      });
    } else res.status(201).json(comment);
  });
};
export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  const { commentId } = req.body;
  const { user } = req;
  if (!commentId) return next(new ApiError("Enter the required data", 400));

  try {
    const comment = await Comment.findById({ _id: commentId });

    if (!comment) return next(new ApiError("Comment not found", 404));
    if (user._id !== comment._authorId.toString()) return next(new ApiError("Access denied", 401));

    await Comment.deleteMany({ _parentId: commentId });

    Comment.deleteOne({ _id: commentId }).exec((err) => {
      if (err) return next(new ApiError(err.message, 500));
      if (comment._parentId) {
        //@ts-ignore
        Comment.updateOne({ _id: comment._parentId }, { $inc: { subCommentsCount: -1 } }).exec((err) => {
          if (err) return next(new ApiError(err.message, 500));
          return res.status(200).json({});
        });
      } else return res.status(200).json({});
    });
  } catch (err) {
    next(err);
  }
};
export const getRecipeComments = (req: Request, res: Response, next: NextFunction) => {
  const { recipeId } = req.params;
  let { page, pageSize, parentId }: any = req.query;
  if (!recipeId) return next(new ApiError("recipeId required", 400));
  if (!page) page = 1;
  if (!pageSize) pageSize = 30;

  const options = {
    populate: "_authorId",
    page,
    limit: pageSize,
    sort: "-createdAt",
  };

  //@ts-ignore
  Comment.paginate({ _parentId: parentId || null, _recipeId: recipeId }, options, (err: any, comments: any) => {
    if (err || !comments) return next(new ApiError(err.message, 500));
    res.status(200).json(comments);
  });
};
