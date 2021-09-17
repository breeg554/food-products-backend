import express from "express";
import verifyToken from "../middlewares/verify-token";
import autorizeAccess from "../middlewares/autorizeAccess";
import mealPlanDay from "../models/mealPlanDay";
import { getMealPlanByDate, getUserMealPlans, create, updateDay } from "../controllers/mealPlan";

const router = express.Router();

router.get("/getPlanByDate", verifyToken, autorizeAccess(["user", "admin"]), getMealPlanByDate);
router.get("/userPlans", verifyToken, autorizeAccess(["user", "admin"]), getUserMealPlans);
router.post("/create", verifyToken, autorizeAccess(["user", "admin"]), create);
router.put("/day/:dayId", verifyToken, autorizeAccess(["user", "admin"]), updateDay);

export default router;
