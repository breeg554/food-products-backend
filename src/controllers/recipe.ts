import Recipe from "../models/recipe";
import ApiError from "../utils/ApiError";

export const get = (req: any, res: any, next: any) => {
  Recipe.paginate({}, {}, (err, recipes) => {
    if (err) return next(new ApiError(err.message, 500));

    res.status(200).json(recipes);
  });
};
