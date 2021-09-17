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
  getQuickRecipes,
  getRecipesByCategory,
  getRecipesByDiet,
} from "../controllers/recipe";
const router = express.Router();

// router.post("/", verifyToken, autorizeAccess(["admin", "user"]), checkNumberOfEnteredProducts, create);
router.post("/", verifyToken, autorizeAccess(["admin", "user"]), create);
router.post("/status", verifyToken, autorizeAccess(["admin", "user"]), changeRecipeStatus);
router.post("/favorite", verifyToken, autorizeAccess(["user", "admin"]), toggleFavoriteRecipe);
router.get("/", verifyToken, autorizeAccess(["user", "admin"]), get);
router.get("/categories/:name", verifyToken, autorizeAccess(["user", "admin"]), getRecipesByCategory);
router.get("/diet/:name", verifyToken, autorizeAccess(["user", "admin"]), getRecipesByDiet); // ???
router.get(
  "/userRecipes/:userId",
  verifyToken,
  autorizeAccess(["user", "admin"]),
  autorizeAccess(["user", "admin"]),
  getUserRecipes
);
router.get("/topRated", verifyToken, getTopRatedRecipes);
router.get("/quick", verifyToken, autorizeAccess(["user", "admin"]), getQuickRecipes);
router.get("/:recipeId", verifyToken, autorizeAccess(["user", "admin"]), autorizeAccess(["admin", "user"]), getRecipe);

export default router;
