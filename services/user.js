import User from "../models/user.js";
import ApiError from "../utils/ApiError.js";
export const getUserDataForResponse = (user) => {
  return {
    email: user.email,
    username: user.username,
    name: user.name,
    surname: user.surname,
    isAnonymous: user.isAnonymous,
    initials: user.initials,
    role: user.role,
    _id: user._id,
    userStats: user.userStats,
  };
};

export async function updateStatsAfterUpdateProductStatus(_userId, currentStatus, previousStatus) {
  try {
    const user = await User.findById({ _id: _userId });

    if (!user.userStats) return;
    const stats = await this.findById(user.userStats);

    if (currentStatus !== previousStatus) {
      if (previousStatus === "in_progress") {
        if (currentStatus === "accepted") {
          stats.products.accepted++;
          stats.products.in_progress--;
          stats.products.productsRep += 10;
        } else {
          stats.products.in_progress--;
          stats.products.rejected++;
        }
      } else if (previousStatus === "accepted") {
        if (currentStatus === "in_progress") {
          stats.products.accepted--;
          stats.products.in_progress++;
          stats.products.productsRep -= 10;
        } else {
          stats.products.accepted--;
          stats.products.rejected++;
          stats.products.productsRep -= 10;
        }
      } else if (previousStatus === "rejected") {
        if (currentStatus === "accepted") {
          stats.products.accepted++;
          stats.products.rejected--;
          stats.products.productsRep += 10;
        } else {
          stats.products.rejected--;
          stats.products.in_progress++;
        }
      }
    }
    stats.reputation = stats.products.productsRep + stats.meal.mealRep;
    stats.save();
  } catch (err) {
    console.log(err);
    return next(ApiError(err.message, 500));
  }
}
