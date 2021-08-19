import { create, get } from "../controllers/recipeCategories.js";
import express from "express";
import verifyToken from "../middlewares/verify-token.js";
import autorizeAccess from "../middlewares/autorizeAccess.js";

const router = express.Router();

router.post("/", verifyToken, autorizeAccess(["admin"]), create);
router.get("/", verifyToken, autorizeAccess(["user", "admin"]), get);

export default router;
