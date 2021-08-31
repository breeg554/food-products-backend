import express from "express";
import verifyToken from "../middlewares/verify-token";
import autorizeAccess from "../middlewares/autorizeAccess";
import {
  get,
  getRecipe,
  getUserRecipes,
  create,
  toggleFavoriteRecipe,
  changeRecipeStatus,
  getTopRatedRecipes,
  getQuickMeals,
} from "../controllers/recipe";
const router = express.Router();

// router.post("/", verifyToken, autorizeAccess(["admin", "user"]), checkNumberOfEnteredProducts, create);
router.post("/", verifyToken, autorizeAccess(["admin", "user"]), create);
router.post("/status", verifyToken, autorizeAccess(["admin", "user"]), changeRecipeStatus);
router.post("/favorite", verifyToken, toggleFavoriteRecipe);
router.get("/", verifyToken, autorizeAccess(["admin", "user"]), get);
router.get("/userRecipes/:userId", verifyToken, getUserRecipes);
router.get("/topRated", verifyToken, getTopRatedRecipes);
router.get("/quick", verifyToken, getQuickMeals);
router.get("/:recipeId", verifyToken, autorizeAccess(["admin", "user"]), getRecipe);

export default router;
