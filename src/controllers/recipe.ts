import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import Recipe from "../models/recipe";
import RecipeCategories from "../models/recipeCategories";
import DietType from "../models/dietType";
import User from "../models/user";
import UserStats from "../models/userStats";
import ApiError from "../utils/ApiError";
import cloudConfig from "../config/cloudinary";
import cloudinary from "../cloudinary";
import { calculateRecipeNutrition } from "../services/recipe";
import { RecipeType } from "../types";

const POPULATE_OPTIONS = [
  { path: "dietTypes", select: "_id name" },
  { path: "category", select: "_id name" },
  { path: "tags", select: "_id name" },
];

export const get = (req: Request, res: Response, next: NextFunction) => {
  let { page, pageSize, search }: any = req.query;
  if (!page || isNaN(page)) page = 1;
  if (!pageSize || isNaN(pageSize)) pageSize = 10;
  pageSize = Number.parseInt(pageSize);

  let query = search ? { name: { $regex: search, $options: "i" } } : {};

  const options = {
    populate: POPULATE_OPTIONS,
    page,
    limit: pageSize,
  };

  //@ts-ignore
  Recipe.paginate(query, options, (err: any, recipes: any) => {
    if (err || !recipes) return next(new ApiError(err.message, 500));
    res.status(200).json(recipes);
  });
};

export const getRecipe = async (req: any, res: Response, next: NextFunction) => {
  const { recipeId } = req.params;

  if (!recipeId) return next(new ApiError("recipeId is required", 400));
  if (recipeId.length !== 24) return next(new ApiError("Invalid recipeId", 400));

  try {
    const recipe: any = await Recipe.findById({ _id: recipeId }).populate([
      { path: "category", select: "_id name" },
      { path: "dietTypes", select: "_id name" },
      { path: "tags", select: "_id name" },
      { path: "_authorId", select: "_id username initials " },
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

    if (recipe.status !== "public" && _id !== recipe._authorId._id.toString())
      return next(new ApiError("recipe not found", 404));

    res.status(200).json(recipe);
  } catch (err) {
    next(err);
  }
};

export const getUserRecipes = (req: Request, res: Response, next: NextFunction) => {
  let { userId } = req.params;
  if (!userId) return next(new ApiError("Enter the user id", 400));
  let { page, pageSize }: any = req.query;
  if (!page) page = 1;
  if (!pageSize) pageSize = 10;

  const options = {
    populate: POPULATE_OPTIONS,
    page,
    limit: pageSize,
    createdAt: "-1",
  };
  const idObj: Object = mongoose.Types.ObjectId(userId);
  //@ts-ignore
  Recipe.paginate({ _authorId: idObj, status: { $ne: "rejected" } }, options, (err: any, recipes: any) => {
    if (err || !recipes) return next(new ApiError(err.message, 500));
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
      small: image.eager[0]?.url,
      medium: image.url,
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

    const user: any = await User.findById({ _id });
    if (!user || !user.userStats) return next(new ApiError("User not found", 404));

    const userStats = await UserStats.findById({ _id: mongoose.Types.ObjectId(user.userStats) });

    if (!userStats) return next(new ApiError("UserStats not found", 404));

    userStats.meal.private--;
    userStats.meal.in_progress++;
    await userStats.save();

    Recipe.updateOne({ _id: recipeId }, { status: "in_progress" }).exec((err, updated) => {
      if (err || !updated) {
        userStats.meal.private++;
        userStats.meal.in_progress--;
        userStats.save();
        return next(new ApiError(err.message, 500));
      }
      res.status(204).json({});
    });
  } catch (err) {
    next(err);
  }
};

export const getTopRatedRecipes = (req: Request, res: Response, next: NextFunction) => {
  let { page, pageSize }: any = req.query;
  const { categories, diet } = req.user.userPreference;
  if (!page || isNaN(page)) page = 1;
  if (!pageSize || isNaN(pageSize)) pageSize = 10;
  pageSize = Number.parseInt(pageSize);

  const options = {
    page,
    limit: pageSize,
  };
  const categoriesIds = categories ? categories.notLike.map((cat) => mongoose.Types.ObjectId(cat)) : [];
  const dietsIds = diet ? diet.notLike.map((diet) => mongoose.Types.ObjectId(diet)) : [];
  const recipeAggregate = Recipe.aggregate([
    {
      $match: {
        isPublic: true,
        category: { $nin: categoriesIds },
        dietTypes: { $nin: dietsIds },
      },
    },
    {
      $set: {
        "rating.rateAvg": {
          $cond: [{ $eq: ["$rating.rateCount", 0] }, 0, { $divide: ["$rating.rateValue", "$rating.rateCount"] }],
        },
      },
    },
    { $sort: { "rating.rateAvg": -1 } },
  ]);

  Recipe.aggregatePaginate(recipeAggregate, options, (err: any, recipes: any) => {
    if (err || !recipes) return next(new ApiError(err.message, 500));

    Recipe.populate(recipes.docs, POPULATE_OPTIONS, (err, results) => {
      if (err || !results) return next(new ApiError(err.message, 500));

      res.status(200).json(recipes);
    });
  });
};

export const getQuickRecipes = (req: Request, res: Response, next: NextFunction) => {
  let { page, pageSize }: any = req.query;
  const { categories, diet } = req.user.userPreference;
  if (!page || isNaN(page)) page = 1;
  if (!pageSize || isNaN(pageSize)) pageSize = 10;
  pageSize = Number.parseInt(pageSize);

  const options = {
    populate: POPULATE_OPTIONS,
    page,
    limit: pageSize,
    createdAt: "-1",
  };

  //@ts-ignore
  Recipe.paginate(
    {
      isPublic: true,
      readyInMinutes: { $lt: 35 },
      category: { $nin: categories.notLike },
      dietTypes: { $nin: diet.notLike },
    },
    options,
    (err: any, recipes: any) => {
      if (err || !recipes) return next(new ApiError(err.message, 500));
      res.status(200).json(recipes);
    }
  );
};

export const getRecipesByCategory = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params;
  if (!name) return next(new ApiError("Enter the category", 400));

  let { page, pageSize, search }: any = req.query;
  if (!page || isNaN(page)) page = 1;
  if (!pageSize || isNaN(pageSize)) pageSize = 10;
  pageSize = Number.parseInt(pageSize);

  try {
    const category = await RecipeCategories.findOne({ name });
    if (!category) throw new ApiError("Category not found", 404);

    const options = {
      populate: POPULATE_OPTIONS,
      page,
      limit: pageSize,
      createdAt: "-1",
    };
    let query = search ? { name: { $regex: search, $options: "i" } } : {};

    //@ts-ignore
    Recipe.paginate({ category: category._id, isPublic: true, ...query }, options, (err: any, recipes: any) => {
      if (err || !recipes) return next(new ApiError(err.message, 500));
      res.status(200).json(recipes);
    });
  } catch (err) {
    next(err);
  }
};
export const getRecipesByDiet = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params;
  if (!name) return next(new ApiError("Enter the diet name", 400));

  let { page, pageSize }: any = req.query;
  if (!page || isNaN(page)) page = 1;
  if (!pageSize || isNaN(pageSize)) pageSize = 10;
  pageSize = Number.parseInt(pageSize);

  try {
    const diet = await DietType.findOne({ name });
    if (!diet) throw new ApiError("Diet not found", 404);

    const options = {
      populate: POPULATE_OPTIONS,
      page,
      limit: pageSize,
      createdAt: "-1",
    };
    //@ts-ignore
    Recipe.paginate(
      { dietTypes: { $elemMatch: { _id: diet._id } }, isPublic: true },
      options,
      (err: any, recipes: any) => {
        if (err || !recipes) return next(new ApiError(err.message, 500));
        res.status(200).json(recipes);
      }
    );
  } catch (err) {
    next(err);
  }
};
