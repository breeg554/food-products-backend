import express from "express";
import verifyToken from "../middlewares/verify-token";
import autorizeAccess from "../middlewares/autorizeAccess";
import { getMealPlanByDate } from "../controllers/mealPlan";

const router = express.Router();

router.get("/getPlanByDate", verifyToken, getMealPlanByDate);

export default router;
