import ApiError from "../utils/ApiError";
import User from "../models/user";
import Product from "../models/product";
import { MAXIMUM_INSERTED_PRODUCTS_WITHIN_ONE_HOUR } from "../config/db";

const ONE_HOUR = 3600000;

const checkNumberOfEnteredProducts = async (req: any, res: any, next: any) => {
  const { user } = req;

  if (user.isAnonymous) {
    try {
      const products: any[] = await Product.find({ _authorId: user._id })
        .sort({ createdAt: "-1" })
        .limit(MAXIMUM_INSERTED_PRODUCTS_WITHIN_ONE_HOUR);

      const len = products.length;
      if (len <= 0) return next();
      const lastProductDate = products[len - 1].createdAt;

      if (
        new Date().valueOf() - lastProductDate.valueOf() < ONE_HOUR &&
        products.length >= MAXIMUM_INSERTED_PRODUCTS_WITHIN_ONE_HOUR
      ) {
        return next(new ApiError("Maximum of products entered per hour. Create an account", 500));
      }

      return next();
    } catch (err) {
      return next(new ApiError(err.message, 500));
    }
  }
  return next();
};

export default checkNumberOfEnteredProducts;
