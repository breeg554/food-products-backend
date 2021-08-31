import { Request, Response, NextFunction } from "express";
import Tags from "../models/tags";
import ApiError from "../utils/ApiError";

export const create = (req: Request, res: Response, next: NextFunction) => {
  const newTag = new Tags(req.body);

  newTag.save((err: any, cat: any) => {
    if (err) return next(new ApiError(err.message, 400));
    res.status(201).json(cat);
  });
};
export const get = (_req: Request, res: Response, next: NextFunction) => {
  Tags.find({})
    .select("_id name")
    .exec((err: any, tags: any) => {
      if (err) return next(new ApiError(err.message, 400));
      res.status(200).json(tags);
    });
};
