import { Request, Response, NextFunction } from "express";
import Recipe from "../models/recipe";
import { RatingType, RecipeType } from "../types";
import Rating from "../models/rating";
import ApiError from "../utils/ApiError";

export const create = (req: Request, res: Response, next: NextFunction) => {
  // const newRating = new Rating(req.body);
  // newCategory.save((err, cat) => {
  //   if (err) return next(new ApiError(err.message, 400));
  //   res.status(201).json(cat);
  // });
};
export const get = (req: Request, res: Response, next: NextFunction) => {
  // Category.find({})
  //   .select("_id name")
  //   .exec((err, categories) => {
  //     if (err) return next(new ApiError(err.message, 400));
  //     res.status(200).json(categories);
  //   });
};
export const rateRecipe = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, recipeId, rateValue } = req.body;
  if (!userId || !recipeId || !rateValue) return next(new ApiError("Enter the required data", 400));

  const ratedBefore = await Rating.find({ _userId: userId, _recipeId: recipeId }).count();
  console.log(ratedBefore);
  if (!ratedBefore) {
    const rate = new Rating({
      _userId: userId,
      _recipeId: recipeId,
      rating: rateValue,
    });
    console.log(rate);
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
