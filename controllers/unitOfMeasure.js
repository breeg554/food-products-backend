import UnitOfMeasure from "../models/unitOfMeasure.js";
import ApiError from "../utils/ApiError.js";

export const create = (req, res, next) => {
  const newUnitOfMeasure = new UnitOfMeasure(req.body);

  newUnitOfMeasure.save((err, measure) => {
    if (err) return next(new ApiError(err.message, 400));
    res.status(201).json(measure);
  });
};
export const get = (req, res, next) => {
  UnitOfMeasure.find({ isActiveForProducts: true })
    .select("_id name")
    .exec((err, units) => {
      if (err) return next(new ApiError(err.message, 400));
      res.status(200).json(units);
    });
};
