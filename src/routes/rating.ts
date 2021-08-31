import { rateRecipe } from "../controllers/rating";
import express from "express";
import verifyToken from "../middlewares/verify-token";
import autorizeAccess from "../middlewares/autorizeAccess";

const router = express.Router();

router.post("/recipe", verifyToken, rateRecipe);

export default router;
