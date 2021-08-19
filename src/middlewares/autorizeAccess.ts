import ApiError from "../utils/ApiError";
const autorizeAccess = (roles: string[]) => {
  return async function (req: any, res: any, next: any) {
    const { user } = req;

    if (!user || !roles.includes(user.role)) {
      return next(new ApiError("Access denied", 403));
    }
    next();
  };
};
export default autorizeAccess;
