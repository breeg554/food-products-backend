import User from "../models/user";
import ApiError from "../utils/ApiError";
export const getUserDataForResponse = (user: any) => {
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

export async function updateStatsAfterUpdateProductStatus(
  _userId: string,
  currentStatus: string,
  previousStatus: string
) {
  try {
    const user: any = await User.findById({ _id: _userId });

    if (!user.userStats) return;
    const stats: any = await this.findById(user.userStats);

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
  } catch (err: any) {
    console.log(err);
    return new ApiError(err.message, 500);
  }
}
