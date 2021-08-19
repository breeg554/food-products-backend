import express from "express";
import productCategories from "./productCategories.js";
import tags from "./tags.js";
import unitOfMeasure from "./unitOfMeasure.js";
import product from "./product.js";
import user from "./user.js";
import recipe from "./recipe.js";
import recipeCategories from "./recipeCategories.js";
import rating from "./rating.js";
import dietType from "./dietType.js";

const router = express.Router();
router.use("/tags", tags);
router.use("/measure", unitOfMeasure);
router.use("/productCategories", productCategories);
router.use("/products", product);
router.use("/recipe", recipe);
router.use("/recipeCategories", recipeCategories);
router.use("/rating", rating);
router.use("/dietType", dietType);
router.use("/", user);

export default router;
