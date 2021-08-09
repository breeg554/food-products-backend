import ApiError from "../utils/ApiError.js";
const autorizeAccess = (roles) => {
  return async function (req, res, next) {
    const { user } = req;

    if (!user || !roles.includes(user.role)) {
      return next(new ApiError("Access denied", 403));
    }
    next();
  };
};
export default autorizeAccess;
