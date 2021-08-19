import DietType from "../models/dietType.js";
import ApiError from "../utils/ApiError.js";

export const create = (req, res, next) => {
  const newDietType = new DietType(req.body);

  newDietType.save((err, diet) => {
    if (err) return next(new ApiError(err.message, 400));
    res.status(201).json(diet);
  });
};
export const get = (req, res, next) => {
  DietType.find({})
    .select("_id name")
    .exec((err, diets) => {
      if (err) return next(new ApiError(err.message, 400));
      res.status(200).json(diets);
    });
};
