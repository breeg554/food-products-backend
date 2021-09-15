import { create, getRecipeComments, deleteComment, dislike, like } from "../controllers/comment";
import express from "express";
import verifyToken from "../middlewares/verify-token";
import autorizeAccess from "../middlewares/autorizeAccess";

const router = express.Router();

router.get("/recipe/:recipeId", verifyToken, getRecipeComments);
router.post("/recipe", verifyToken, create);
router.post("/like/:commentId", verifyToken, like);
router.post("/dislike/:commentId", verifyToken, dislike);
router.delete("/recipe", verifyToken, deleteComment);

export default router;
