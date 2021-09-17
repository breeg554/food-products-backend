import { Request, Response, NextFunction } from "express";
import DietType from "../models/dietType";
import ApiError from "../utils/ApiError";

export const create = (req: Request, res: Response, next: NextFunction) => {
  const newDietType = new DietType(req.body);

  newDietType.save((err: any, diet: any) => {
    if (err) return next(new ApiError(err.message, 400));
    res.status(201).json(diet);
  });
};
export const get = (_req: Request, res: Response, next: NextFunction) => {
  DietType.find({})
    .select("_id name")
    .exec((err: any, diets: any) => {
      if (err) return next(new ApiError(err.message, 400));
      res.status(200).json(diets);
    });
};
