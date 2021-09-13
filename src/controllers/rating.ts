import { Request, Response, NextFunction } from "express";
import Recipe from "../models/recipe";
import { RatingType, RecipeType } from "../types";
import Rating from "../models/rating";
import ApiError from "../utils/ApiError";

export const rate = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, recipeId, rateValue } = req.body;
  if (!userId || !recipeId || !rateValue) return next(new ApiError("Enter the required data", 400));

  const ratedBefore = await Rating.find({ _userId: userId, _recipeId: recipeId }).count();

  if (!ratedBefore) {
    const rate = new Rating({
      _userId: userId,
      _recipeId: recipeId,
      rating: rateValue,
    });

    rate.save((err: any, inserted: RatingType) => {
      if (err || !inserted) return next(new ApiError(err.message, 500));

      Recipe.updateOne(
        { _id: recipeId },
        //@ts-ignore
        { $inc: { "rating.rateCount": 1, "rating.rateValue": rateValue } },
        (err: any, updated: RecipeType) => {
          if (err || !updated) return next(new ApiError(err.message, 500));
          res.status(204).json({});
        }
      );
    });
  } else {
    return next(new ApiError("User has already rated recipe", 409));
  }
};
