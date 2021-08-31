import { Request, Response, NextFunction } from "express";
import Category from "../models/recipeCategories";
import ApiError from "../utils/ApiError";

export const create = (req: Request, res: Response, next: NextFunction) => {
  const newCategory = new Category(req.body);

  newCategory.save((err: any, cat: any) => {
    if (err) return next(new ApiError(err.message, 400));
    res.status(201).json(cat);
  });
};
export const get = (_req: Request, res: Response, next: NextFunction) => {
  Category.find({})
    .select("_id name")
    .exec((err: any, categories: any) => {
      if (err) return next(new ApiError(err.message, 400));
      res.status(200).json(categories);
    });
};
