import express from "express";
import verifyToken from "../middlewares/verify-token.js";
import autorizeAccess from "../middlewares/autorizeAccess.js";
import { get } from "../controllers/recipe.js";
const router = express.Router();

// router.post("/", verifyToken, autorizeAccess(["admin", "user"]), checkNumberOfEnteredProducts, create);
router.get("/", verifyToken, autorizeAccess(["admin", "user"]), get);

export default router;
