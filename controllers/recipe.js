import Recipe from "../models/recipe.js";
import ApiError from "../utils/ApiError.js";

export const get = (req, res, next) => {
  Recipe.paginate({}, {}, (err, recipes) => {
    if (err) return next(new ApiError(err.message, 500));

    res.status(200).json(recipes);
  });
};
