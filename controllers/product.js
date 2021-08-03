import Product from "../models/product.js";
import ApiError from "../utils/ApiError.js";
import { nutritionProductSort } from "../services/product.js";
import {
  MEDIUM_CALORIC_DEMAND,
  DAILY_REQUIREMENT_OF_PROTEIN,
  DAILY_REQUIREMENT_OF_CARB,
  DAILY_REQUIREMENT_OF_FAT,
} from "../utils/caloricConsts.js";

export const create = (req, res, next) => {
  const sumOfCaloricBreakDown =
    req.body.protein * 4 + req.body.fat * 9 + req.body.carb * 4;
  const newProduct = new Product({
    ...req.body,
    _authorId: req.user._id,
    nutrition: {
      nutrients: {
        carb: {
          amount: req.body.carb,
          percentOfDailyNeeds: (req.body.carb / DAILY_REQUIREMENT_OF_CARB) * 100,
        },
        fat: {
          amount: req.body.fat,
          percentOfDailyNeeds: (req.body.fat / DAILY_REQUIREMENT_OF_FAT) * 100,
        },
        protein: {
          amount: req.body.protein,
          percentOfDailyNeeds: (req.body.protein / DAILY_REQUIREMENT_OF_PROTEIN) * 100,
        },
        calories: {
          amount: req.body.calories,
          percentOfDailyNeeds: (req.body.calories / MEDIUM_CALORIC_DEMAND) * 100,
        },
      },
      caloricBreakdown: {
        percentProtein: sumOfCaloricBreakDown
          ? ((req.body.protein * 4) / sumOfCaloricBreakDown) * 100
          : 0,
        percentFat: sumOfCaloricBreakDown
          ? ((req.body.fat * 9) / sumOfCaloricBreakDown) * 100
          : 0,
        percentCarbs: sumOfCaloricBreakDown
          ? ((req.body.carb * 4) / sumOfCaloricBreakDown) * 100
          : 0,
      },
      totalWeight: {
        amount: req.body.totalWeight,
      },
    },
  });

  newProduct.save((err, product) => {
    if (err && err.code === 11000)
      return next(new ApiError("product already exists", 400));
    else if (err) return next(new ApiError(err.message, 400));
    res.status(201).json(product);
  });
};

export const get = (req, res, next) => {
  let { page, pageSize, search, sortColumn, order } = req.query;
  if (!page) page = 1;
  if (!pageSize) pageSize = 15;

  const query = search ? { name: { $regex: search, $options: "i" } } : {};
  const sort = sortColumn ? nutritionProductSort(sortColumn, order) : "";

  Product.paginate(query, { page, limit: pageSize, sort }, (err, products) => {
    if (err) return next(new ApiError(err.message, 400));
    res.status(200).json(products);
  });
};
