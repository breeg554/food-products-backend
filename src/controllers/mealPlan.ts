import { Request, Response, NextFunction } from "express";
import { IngredientType, ShoppingListType } from "../types";
import dateFormat, { checkIfDate, checkIfString } from "../utils/dateFormat";
import MealPlan from "../models/mealPlan";
import ShoppingList from "../models/shoppingList";
import ApiError from "../utils/ApiError";

export const getMealPlanByDate = (req: Request, res: Response, next: NextFunction) => {
  let { startDate, endDate } = req.query;
  const { user } = req;
  if (!checkIfDate(startDate) || !checkIfDate(endDate)) return next(new ApiError("Incorrect dates", 400));
  // const mealPlan = new MealPlan({
  //   _userId: user._id,
  //   startDate,
  //   endDate,
  //   days: [
  //     {
  //       dayNumber: 1,
  //       date: "2021-09-06",
  //       meals: [],
  //     },
  //     {
  //       dayNumber: 2,
  //       date: "2021-09-07",
  //       meals: [],
  //     },
  //     {
  //       dayNumber: 3,
  //       date: "2021-09-08",
  //       meals: [],
  //     },
  //     {
  //       dayNumber: 4,
  //       date: "2021-09-09",
  //       meals: [],
  //     },
  //     {
  //       dayNumber: 5,
  //       date: "2021-09-10",
  //       meals: [],
  //     },
  //     {
  //       dayNumber: 6,
  //       date: "2021-09-11",
  //       meals: [],
  //     },
  //     {
  //       dayNumber: 7,
  //       date: "2021-09-12",
  //       meals: [],
  //     },
  //   ],
  // });
  // mealPlan.save();
  MealPlan.findOne({
    startDate: dateFormat(startDate.toString(), "isoDate"),
    endDate: dateFormat(endDate.toString(), "isoDate"),
    _userId: user._id,
  }).exec(async (err: any, mealPlan: any) => {
    if (err) return next(new ApiError(err.message, 500));
    return res.status(200).json(mealPlan);
  });
};
