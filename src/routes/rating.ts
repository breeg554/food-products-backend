import { rate } from "../controllers/rating";
import express from "express";
import verifyToken from "../middlewares/verify-token";
import autorizeAccess from "../middlewares/autorizeAccess";

const router = express.Router();

router.post("/recipe", verifyToken, autorizeAccess(["user", "admin"]), rate);

export default router;
