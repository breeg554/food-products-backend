import { create, getRecipeComments, deleteComment, dislike, like } from "../controllers/comment";
import express from "express";
import verifyToken from "../middlewares/verify-token";
import autorizeAccess from "../middlewares/autorizeAccess";

const router = express.Router();

router.get("/recipe/:recipeId", verifyToken, autorizeAccess(["user", "admin"]), getRecipeComments);
router.post("/recipe", verifyToken, autorizeAccess(["user", "admin"]), create);
router.post("/like/:commentId", verifyToken, autorizeAccess(["user", "admin"]), like);
router.post("/dislike/:commentId", verifyToken, autorizeAccess(["user", "admin"]), dislike);
router.delete("/recipe", verifyToken, autorizeAccess(["user", "admin"]), deleteComment);

export default router;
