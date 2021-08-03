import Tags from "../models/tags.js";
import ApiError from "../utils/ApiError.js";

export const create = (req, res, next) => {
  const newTag = new Tags(req.body);

  newTag.save((err, cat) => {
    if (err) return next(new ApiError(err.message, 400));
    res.status(201).json(cat);
  });
};
export const get = (req, res, next) => {
  Tags.find({})
    .select("_id name")
    .exec((err, tags) => {
      if (err) return next(new ApiError(err.message, 400));
      res.status(200).json(tags);
    });
};
