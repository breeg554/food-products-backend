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
} from "../controllers/recipe";
const router = express.Router();

// router.post("/", verifyToken, autorizeAccess(["admin", "user"]), checkNumberOfEnteredProducts, create);
router.post("/", verifyToken, autorizeAccess(["admin", "user"]), create);
router.post("/status", verifyToken, autorizeAccess(["admin", "user"]), changeRecipeStatus);
router.post("/favorite", verifyToken, toggleFavoriteRecipe);
router.get("/", verifyToken, autorizeAccess(["admin", "user"]), get);
router.get("/:recipeId", verifyToken, autorizeAccess(["admin", "user"]), getRecipe);
router.get("/userRecipes/:userId", verifyToken, getUserRecipes);

export default router;
