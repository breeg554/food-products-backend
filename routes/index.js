import express from "express";
import productCategories from "./productCategories.js";
import tags from "./tags.js";
import unitOfMeasure from "./unitOfMeasure.js";
import product from "./product.js";
import user from "./user.js";

const router = express.Router();
router.use("/tags", tags);
router.use("/measure", unitOfMeasure);
router.use("/productCategories", productCategories);
router.use("/products", product);
router.use("/", user);

export default router;
