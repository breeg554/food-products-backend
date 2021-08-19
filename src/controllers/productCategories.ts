import Category from "../models/productCategories";
import ApiError from "../utils/ApiError";

export const create = (req: any, res: any, next: any) => {
  const newCategory = new Category(req.body);

  newCategory.save((err: any, cat: any) => {
    if (err) return next(new ApiError(err.message, 400));
    res.status(201).json(cat);
  });
};
export const get = (req: any, res: any, next: any) => {
  Category.find({})
    .select("_id name")
    .exec((err: any, categories: any) => {
      if (err) return next(new ApiError(err.message, 400));
      res.status(200).json(categories);
    });
};
