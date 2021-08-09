import Product from "../models/product.js";
import ApiError from "../utils/ApiError.js";
import { nutritionProductSort, productStatus } from "../services/product.js";
import {
  MEDIUM_CALORIC_DEMAND,
  DAILY_REQUIREMENT_OF_PROTEIN,
  DAILY_REQUIREMENT_OF_CARB,
  DAILY_REQUIREMENT_OF_FAT,
} from "../utils/caloricConsts.js";

export const create = (req, res, next) => {
  const sumOfCaloricBreakDown = req.body.protein * 4 + req.body.fat * 9 + req.body.carb * 4;

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
        percentProtein: sumOfCaloricBreakDown ? ((req.body.protein * 4) / sumOfCaloricBreakDown) * 100 : 0,
        percentFat: sumOfCaloricBreakDown ? ((req.body.fat * 9) / sumOfCaloricBreakDown) * 100 : 0,
        percentCarbs: sumOfCaloricBreakDown ? ((req.body.carb * 4) / sumOfCaloricBreakDown) * 100 : 0,
      },
    },
  });

  newProduct.save((err, product) => {
    if (err && err.code === 11000) return next(new ApiError("Product already exists", 409));
    else if (err) return next(new ApiError(err.message, 500));
    res.status(201).json(product);
  });
};

export const get = (req, res, next) => {
  let { page, pageSize, search, sortColumn, order, status } = req.query;
  if (!page) page = 1;
  if (!pageSize) pageSize = 15;
  if (status) status = status.split(",");

  let query = search ? { name: { $regex: search, $options: "i" } } : {};
  query = status ? { ...query, status: status } : { ...query };

  const sort = sortColumn ? nutritionProductSort(sortColumn, order) : "";

  const options = {
    populate: [
      { path: "unitOfMeasure", select: "_id name" },
      { path: "category", select: "_id name" },
      { path: "tags", select: "_id name" },
    ],
    page,
    limit: pageSize,
    sort,
  };

  Product.paginate(query, options, (err, products) => {
    if (err) return next(new ApiError(err.message, 500));

    res.status(200).json(products);
  });
};

export const getByUserId = (req, res, next) => {
  let { userId } = req.params;
  if (!userId) return next(new ApiError("User id required", 400));

  let { page, pageSize, status } = req.query;
  if (!page) page = 1;
  if (!pageSize) pageSize = 5;
  if (status && !productStatus.includes(status)) return next(new ApiError("Bad product status", 400));

  const query = status ? { _authorId: userId, status } : { _authorId: userId };

  const options = {
    populate: [
      { path: "unitOfMeasure", select: "_id name" },
      { path: "category", select: "_id name" },
      { path: "tags", select: "_id name" },
    ],
    page,
    limit: pageSize,
    createdAt: "-1",
  };

  Product.paginate(query, options, (err, products) => {
    if (err) return next(new ApiError(err.message, 500));
    res.status(200).json(products);
  });
};
export const updateById = async (req, res, next) => {
  try {
    let { id } = req.params;
    Product.updateOne({ _id: id }, { name: "ccc" });
    Product.findOneAndUpdate({ _id: id }, { name: "ggg" }, (err, product) => {
      if (err) return next(new ApiError(err.message, 400));
      res.status(204).json();
    });
  } catch (err) {
    next(err);
  }
};
