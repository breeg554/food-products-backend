import UnitOfMeasure from "../models/unitOfMeasure";
import ApiError from "../utils/ApiError";

export const create = (req: any, res: any, next: any) => {
  const newUnitOfMeasure = new UnitOfMeasure(req.body);

  newUnitOfMeasure.save((err: any, measure: any) => {
    if (err) return next(new ApiError(err.message, 400));
    res.status(201).json(measure);
  });
};
export const get = (req: any, res: any, next: any) => {
  UnitOfMeasure.find({ isActiveForProducts: true })
    .select("_id name")
    .exec((err: any, units: any) => {
      if (err) return next(new ApiError(err.message, 400));
      res.status(200).json(units);
    });
};
