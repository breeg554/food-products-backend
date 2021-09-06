import express from "express";
import productCategories from "./productCategories";
import tags from "./tags";
import unitOfMeasure from "./unitOfMeasure";
import product from "./product";
import user from "./user";
import recipe from "./recipe";
import recipeCategories from "./recipeCategories";
import rating from "./rating";
import dietType from "./dietType";
import mealPlan from "./mealPlan";
import shoppingList from "./shoppingList";

const router = express.Router();
router.use("/tags", tags);
router.use("/measure", unitOfMeasure);
router.use("/productCategories", productCategories);
router.use("/products", product);
router.use("/recipe", recipe);
router.use("/recipeCategories", recipeCategories);
router.use("/rating", rating);
router.use("/dietType", dietType);
router.use("/shoppingList", shoppingList);
router.use("/mealPlan", mealPlan);
router.use("/", user);

export default router;
