import express from "express";
import verifyToken from "../middlewares/verify-token";
import autorizeAccess from "../middlewares/autorizeAccess";
import mealPlanDay from "../models/mealPlanDay";
import { getMealPlanByDate, create, updateDay } from "../controllers/mealPlan";

const router = express.Router();

router.get("/getPlanByDate", verifyToken, getMealPlanByDate);
router.post("/create", verifyToken, create);
router.put("/day/:dayId", verifyToken, updateDay);

export default router;
