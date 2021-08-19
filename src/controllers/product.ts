import Product from "../models/product";
import ApiError from "../utils/ApiError";
import { nutritionProductSort, productStatus } from "../services/product";
import {
  MEDIUM_CALORIC_DEMAND,
  DAILY_REQUIREMENT_OF_PROTEIN,
  DAILY_REQUIREMENT_OF_CARB,
  DAILY_REQUIREMENT_OF_FAT,
} from "../utils/caloricConsts";

export const create = (req: any, res: any, next: any) => {
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

  newProduct.save((err: any, product: any) => {
    if (err && err.code === 11000) return next(new ApiError("Product already exists", 409));
    else if (err) return next(new ApiError(err.message, 500));
    res.status(201).json(product);
  });
};

export const get = (req: any, res: any, next: any) => {
  let { page, pageSize, search, sortColumn, order, status } = req.query;
  if (!page) page = 1;
  if (!pageSize) pageSize = 15;
  if (status) status = status.split(",");

  let query = search ? { name: { $regex: search, $options: "i" } } : {};
  //@ts-ignore
  query = status ? { ...query, status } : { ...query };

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

  Product.paginate(query, options, (err: any, products: any) => {
    if (err) return next(new ApiError(err.message, 500));

    res.status(200).json(products);
  });
};

export const getByUserId = (req: any, res: any, next: any) => {
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

  Product.paginate(query, options, (err: any, products: any) => {
    if (err) return next(new ApiError(err.message, 500));
    res.status(200).json(products);
  });
};
export const updateById = async (req: any, res: any, next: any) => {
  try {
    let { id } = req.params;
    Product.updateOne({ _id: id }, { name: "ccc" });
    await Product.findOneAndUpdate({ _id: id }, { name: "ggg" });
    res.status(204).json();
  } catch (err: any) {
    next(err);
  }
};
