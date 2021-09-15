import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError";
import { ACCESS_TOKEN_SECRET } from "../config/jwt";

const verifyToken = (req: Request, _res: Response, next: NextFunction) => {
  // const token = req.header("Authorization");
  const token = req.cookies.accessToken;

  if (!token) return next(new ApiError("Access denied", 401));

  try {
    // const userToken = token.substring(7, token.length);
    const isVerified: any = jwt.verify(token, ACCESS_TOKEN_SECRET);

    if (isVerified) {
      req.user = {
        _id: isVerified.data.id,
        role: isVerified.data.role,
        email: isVerified.data.email,
        isAnonymous: isVerified.data.isAnonymous,
        userPreference: isVerified.data.userPreference,
      };
    }
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return next(new ApiError("Token expired", 403));
    } else {
      return next(new ApiError("Auth failed", 401));
    }
  }
  next();
};
export default verifyToken;
