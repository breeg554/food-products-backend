import { Request, Response, NextFunction } from "express";
import { IngredientType, MealPlanDayType, MealPlanType, ShoppingListType } from "../types";
import { getShoppingListIngredientsFromMealPlanDay } from "../services/shoppingList";
import ShoppingList from "../models/shoppingList";
import MealPlan from "../models/mealPlan";
import MealPlanDay from "../models/mealPlanDay";
import ApiError from "../utils/ApiError";

export const updateShoppingList = async (req: Request, res: Response, next: NextFunction) => {
  let { ingredients } = req.body;
  let { user } = req;
  if (!ingredients) return next(new ApiError("Missing ingredients attribute", 400));

  try {
    const shoppingList = await ShoppingList.findOne({ _userId: user._id });

    if (shoppingList) {
      let tmpIngredients: IngredientType[] = [...shoppingList.ingredients];

      ingredients.forEach((ingredient: IngredientType) => {
        const index = tmpIngredients.findIndex((tmp) => tmp.product.toString() === ingredient.product.toString());

        if (index > -1) tmpIngredients[index].amount += ingredient.amount;
        else tmpIngredients.push(ingredient);
      });

      shoppingList.ingredients = tmpIngredients;
      shoppingList.isClearRequested = false;
      shoppingList.save((err: any, shoppingList: any) => {
        if (err) return next(new ApiError(err.message, 500));
        res.status(200).json(shoppingList);
      });
    } else {
      const newShoppingList = new ShoppingList({ _userId: user._id, ingredients });
      newShoppingList.save((err: any, shoppingList: any) => {
        if (err || !shoppingList) return next(new ApiError(err.message, 500));
        res.status(201).json(shoppingList);
      });
    }
  } catch (err) {
    next(err);
  }
};

export const generateListFromMealPlan = async (req: Request, res: Response, next: NextFunction) => {
  let { mealPlanId, mealPlanDayId } = req.body;
  let { user } = req;
  if (!mealPlanId) return next(new ApiError("mealPlanId is required", 400));

  try {
    let shoppingListIngredients: IngredientType[] = [];
    if (!mealPlanDayId) {
      const mealPlan: MealPlanType = await MealPlan.findById({
        _id: mealPlanId,
      }).populate([
        {
          path: "days",
          model: "MealPlanDay",
          populate: { path: "meals.recipe" },
        },
      ]);

      if (!mealPlan) return next(new ApiError("MealPlan not found", 404));

      const days = [...mealPlan.days];

      days.forEach((day) => {
        shoppingListIngredients = getShoppingListIngredientsFromMealPlanDay(day, shoppingListIngredients);
      });
    } else {
      const mealPlanDay: MealPlanDayType = await MealPlanDay.findById({
        _id: mealPlanDayId,
      }).populate([
        {
          path: "meals.recipe",
        },
      ]);
      if (!mealPlanDay) return next(new ApiError("MealPlanDay not found", 404));
      shoppingListIngredients = getShoppingListIngredientsFromMealPlanDay(mealPlanDay, shoppingListIngredients);
    }

    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    ShoppingList.findOneAndUpdate(
      { _userId: user._id },
      { _userId: user._id, ingredients: shoppingListIngredients },
      options
    )
      .populate([
        {
          path: "ingredients.product",
          populate: [
            { path: "category", select: "_id name" },
            { path: "unitOfMeasure", select: "_id name" },
            { path: "tags", select: "_id name" },
          ],
        },
      ])
      .exec((err: any, newList: ShoppingListType) => {
        if (err || !newList) return next(new ApiError(err.message, 500));
        res.status(200).json(newList);
      });
  } catch (err) {
    next(err);
  }
};
export const getShoppingList = (req: Request, res: Response, next: NextFunction) => {
  let { userId } = req.body;
  if (!userId) return next(new ApiError("userId is required", 400));

  ShoppingList.findOne({ _userId: userId })
    .populate([
      {
        path: "ingredients.product",
        populate: [
          { path: "category", select: "_id name" },
          { path: "unitOfMeasure", select: "_id name" },
          { path: "tags", select: "_id name" },
        ],
      },
    ])
    .exec((err: any, shoppingList: any) => {
      if (err) return next(new ApiError(err.message, 500));
      else if (!shoppingList) return next(new ApiError("Shopping list not found", 404));
      res.status(200).json(shoppingList);
    });
};
export const toggleProductBoughtStatus = async (req: Request, res: Response, next: NextFunction) => {
  const { listId, productId, status } = req.body;
  const { _id } = req.user;

  if (!listId) return next(new ApiError("listId is required", 400));
  if (!productId) return next(new ApiError("productId is required", 400));
  if (status !== true && status !== false) return next(new ApiError("status is required", 400));
  try {
    await ShoppingList.updateOne(
      { _id: listId, _userId: _id, "ingredients.product": productId },
      {
        $set: {
          "ingredients.$.bought": !status,
        },
      }
    );
    res.status(204).json("");
  } catch (err) {
    next(err);
  }
};
export const clearShoppingList = (req: Request, res: Response, next: NextFunction) => {
  let { listId } = req.params;
  const { user } = req;
  if (!listId) return next(new ApiError("listId is required", 400));

  ShoppingList.updateOne({ _id: listId, _userId: user._id }, { ingredients: [] }).exec(
    (err: any, shoppingList: any) => {
      if (err) return next(new ApiError(err.message, 500));
      else if (!shoppingList) return next(new ApiError("Shopping list not found", 404));
      res.status(200).json(shoppingList);
    }
  );
};
export const changeIsClearRequested = (req: Request, res: Response, next: NextFunction) => {
  let { listId } = req.params;
  let { status } = req.body;
  const { user } = req;
  if (status !== false && status !== true) return next(new ApiError("status is required", 400));
  if (!listId) return next(new ApiError("listId is required", 400));

  ShoppingList.updateOne({ _id: listId, _userId: user._id }, { isClearRequested: status }).exec(
    (err: any, shoppingList: any) => {
      if (err) return next(new ApiError(err.message, 500));
      else if (!shoppingList) return next(new ApiError("Shopping list not found", 404));
      res.status(204).json("");
    }
  );
};
