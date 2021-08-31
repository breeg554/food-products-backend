import { Request, Response, NextFunction } from "express";
import UnitOfMeasure from "../models/unitOfMeasure";
import ApiError from "../utils/ApiError";

export const create = (req: Request, res: Response, next: NextFunction) => {
  const newUnitOfMeasure = new UnitOfMeasure(req.body);

  newUnitOfMeasure.save((err: any, measure: any) => {
    if (err) return next(new ApiError(err.message, 400));
    res.status(201).json(measure);
  });
};
export const get = (req: Request, res: Response, next: NextFunction) => {
  UnitOfMeasure.find({ isActiveForProducts: true })
    .select("_id name")
    .exec((err: any, units: any) => {
      if (err) return next(new ApiError(err.message, 400));
      res.status(200).json(units);
    });
};
