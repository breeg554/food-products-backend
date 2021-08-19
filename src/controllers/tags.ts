import Tags from "../models/tags";
import ApiError from "../utils/ApiError";

export const create = (req: any, res: any, next: any) => {
  const newTag = new Tags(req.body);

  newTag.save((err: any, cat: any) => {
    if (err) return next(new ApiError(err.message, 400));
    res.status(201).json(cat);
  });
};
export const get = (req: any, res: any, next: any) => {
  Tags.find({})
    .select("_id name")
    .exec((err: any, tags: any) => {
      if (err) return next(new ApiError(err.message, 400));
      res.status(200).json(tags);
    });
};
