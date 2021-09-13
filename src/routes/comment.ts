import { create, getRecipeComments, deleteComment } from "../controllers/comment";
import express from "express";
import verifyToken from "../middlewares/verify-token";
import autorizeAccess from "../middlewares/autorizeAccess";

const router = express.Router();

router.get("/recipe/:recipeId", verifyToken, getRecipeComments);
router.post("/recipe", verifyToken, create);
router.delete("/recipe", verifyToken, deleteComment);

export default router;
