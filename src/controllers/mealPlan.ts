import { Request, Response, NextFunction } from "express";
import { IngredientType, ShoppingListType } from "../types";
import dateFormat, { checkIfDate, checkIfString, addDays } from "../utils/dateFormat";
import MealPlanDay from "../models/mealPlanDay";
import MealPlan from "../models/mealPlan";
import ShoppingList from "../models/shoppingList";
import ApiError from "../utils/ApiError";

export const getMealPlanByDate = async (req: Request, res: Response, next: NextFunction) => {
  let { startDate, endDate } = req.query;
  const { user } = req;
  console.log(user);
  if (!checkIfDate(startDate) || !checkIfDate(endDate)) return next(new ApiError("Incorrect dates", 400));

  MealPlan.findOne({
    startDate: dateFormat(startDate.toString(), "isoDate"),
    endDate: dateFormat(endDate.toString(), "isoDate"),
    _userId: user._id,
  })
    .populate([{ path: "days", model: "MealPlanDay", populate: { path: "meals.recipe" } }])
    .exec(async (err: any, mealPlan: any) => {
      if (err) return next(new ApiError(err.message, 500));
      return res.status(200).json(mealPlan);
    });
};
export const getUserMealPlans = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req;

  MealPlan.find({
    _userId: user._id,
  })
    .sort("-endDate")
    .populate([{ path: "days", model: "MealPlanDay" }])
    .exec(async (err: any, mealPlan: any) => {
      if (err) return next(new ApiError(err.message, 500));
      return res.status(200).json(mealPlan);
    });
};
export const create = async (req: Request, res: Response, next: NextFunction) => {
  let mealPlan = req.body;
  const { user } = req;

  if (!mealPlan || !mealPlan.days || mealPlan.days.length === 0) return next(new ApiError("Incorrect data", 400));
  if (!checkIfDate(mealPlan.startDate) || !checkIfDate(mealPlan.endDate))
    return next(new ApiError("Incorrect dates", 400));

  const days = mealPlan.days.map((day: any) => ({ ...day, _userId: user._id }));
  let ids: string[] = [];
  try {
    const insertedDays = await MealPlanDay.insertMany(days);
    insertedDays.forEach((day: any) => {
      ids.push(day._id);
    });

    const newMealPlan = new MealPlan({
      _userId: user._id,
      startDate: mealPlan.startDate,
      endDate: mealPlan.endDate,
      days: ids,
    });

    const insertedPlan = await newMealPlan.save();

    MealPlan.findById({ _id: insertedPlan._id })
      .populate([{ path: "days", model: "MealPlanDay", populate: { path: "meals.recipe" } }])
      .exec((err, plan) => {
        if (err) return next(new ApiError(err.message, 500));
        res.status(201).json(plan);
      });
  } catch (err) {
    ids.forEach((id: string) => {
      MealPlanDay.remove({ _id: id });
    });
    next(err);
  }
};
export const updateDay = async (req: Request, res: Response, next: NextFunction) => {
  let day = req.body;
  let { dayId } = req.params;
  const { user } = req;

  if (!dayId) return next(new ApiError("Provide day id", 400));
  if (!day || !day.meals || !day.dayNumber) return next(new ApiError("Incorrect data", 400));
  if (!checkIfDate(day.date)) return next(new ApiError("Incorrect date", 400));

  try {
    const mealsIds = day.meals.map((meal: any) => ({ ...meal, recipe: meal.recipe._id }));
    await MealPlanDay.findByIdAndUpdate(
      { _id: dayId },
      { date: day.date, dayNumber: day.dayNumber, meals: [...mealsIds], _userId: user._id }
    );
    res.status(204).json({});
  } catch (err) {
    next(err);
  }
};
