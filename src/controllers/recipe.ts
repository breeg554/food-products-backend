import { Request, Response, NextFunction } from "express";
import Recipe from "../models/recipe";
import User from "../models/user";
import ApiError from "../utils/ApiError";
import cloudConfig from "../config/cloudinary";
import cloudinary from "../cloudinary";
import { calculateRecipeNutrition } from "../services/recipe";
import { RecipeType } from "../types";

export const get = (_req: Request, res: Response, next: NextFunction) => {
  Recipe.paginate({}, {}, (err, recipes) => {
    if (err) return next(new ApiError(err.message, 500));

    res.status(200).json(recipes);
  });
};
export const getRecipe = async (req: any, res: Response, next: NextFunction) => {
  const { recipeId } = req.params;

  if (!recipeId) return next(new ApiError("recipeId is required", 400));
  if (recipeId.length !== 24) return next(new ApiError("Invalid recipeId", 400));

  try {
    const recipe: RecipeType = await Recipe.findById({ _id: recipeId }).populate([
      { path: "category", select: "_id name" },
      { path: "dietTypes", select: "_id name" },
      { path: "tags", select: "_id name" },
      {
        path: "ingredients.product",
        populate: [
          { path: "category", select: "_id name" },
          { path: "unitOfMeasure", select: "_id name" },
          { path: "tags", select: "_id name" },
        ],
      },
    ]);

    if (!recipe) return next(new ApiError("recipe not found", 404));
    const { _id } = req.user;

    if (recipe.status !== "public" && _id !== recipe._authorId.toString())
      return next(new ApiError("recipe not found", 404));

    res.status(200).json(recipe);
  } catch (err) {
    next(err);
  }
};
export const getUserRecipes = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  if (!userId) return next(new ApiError("Enter the user id", 400));
  let { page, pageSize }: any = req.query;
  if (!page) page = 1;
  if (!pageSize) pageSize = 10;

  const options = {
    populate: [
      { path: "dietTypes", select: "_id name" },
      { path: "category", select: "_id name" },
      { path: "tags", select: "_id name" },
    ],
    page,
    limit: pageSize,
    createdAt: "-1",
  };
  Recipe.paginate({ _authorId: userId, status: { $ne: "rejected" } }, options, (err: any, recipes: any) => {
    if (err) return next(new ApiError(err.message, 500));
    res.status(200).json(recipes);
  });
};
export const create = (req: Request, res: Response, next: NextFunction) => {
  const { user } = req;
  const { name, servings, readyInMinutes, category, tags, dietType, ingredients, preparation } = req.body;

  const cloudOptions = { upload_preset: cloudConfig.api_preset, folder: "mealPlanner" };

  cloudinary.uploader.upload(req.body.image, cloudOptions, (err, image) => {
    if (err || !image) return next(new ApiError(err.message, 500));
    const fromCloud = {
      small: image.url,
      medium: image.eager[0]?.url,
    };
    const nutrition = calculateRecipeNutrition(ingredients);
    const newRecipe = new Recipe({
      name,
      servings,
      readyInMinutes,
      category,
      tags,
      dietType,
      nutrition,
      ingredients,
      preparation,
      _authorId: user._id,
      image: fromCloud,
    });
    newRecipe.save((err: any, recipe: RecipeType) => {
      if (err || !recipe) return next(new ApiError(err.message, 500));
      res.status(200).json(recipe);
    });
  });
};

export const toggleFavoriteRecipe = async (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.user;
  const { recipeId } = req.body;

  if (!recipeId) return next(new ApiError("recipeId is required", 400));

  User.updateOne(
    { _id },
    [
      {
        $set: {
          favoriteRecipes: {
            $cond: [
              { $in: [recipeId, "$favoriteRecipes"] },
              { $setDifference: ["$favoriteRecipes", [recipeId]] },
              { $concatArrays: ["$favoriteRecipes", [recipeId]] },
            ],
          },
        },
      },
    ],
    {},
    (err, user) => {
      if (err || !user) return next(new ApiError(err.message, 500));

      res.status(204).json("");
    }
  );
};

export const changeRecipeStatus = async (req: Request, res: Response, next: NextFunction) => {
  const { recipeId } = req.body;

  if (!recipeId) return next(new ApiError("recipeId is required", 400));
  if (recipeId.length !== 24) return next(new ApiError("Invalid recipeId", 400));

  try {
    const recipe: RecipeType = await Recipe.findById({ _id: recipeId });

    if (!recipe) return next(new ApiError("recipe not found", 404));
    const { _id } = req.user;

    if (_id !== recipe._authorId.toString()) return next(new ApiError("Access denied", 401));

    if (recipe.status === "in_progress") return next(new ApiError("Status change request already sent", 400));
    else if (recipe.status === "public") return next(new ApiError("Recipe status already changed", 400));

    Recipe.updateOne({ _id: recipeId }, { status: "in_progress" }).exec((err, updated) => {
      if (err || !updated) return next(new ApiError(err.message, 500));
      res.status(204).json({});
    });
  } catch (err) {
    next(err);
  }
};
