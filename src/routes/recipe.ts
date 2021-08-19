import express from "express";
import verifyToken from "../middlewares/verify-token";
import autorizeAccess from "../middlewares/autorizeAccess";
import { get } from "../controllers/recipe";
const router = express.Router();

// router.post("/", verifyToken, autorizeAccess(["admin", "user"]), checkNumberOfEnteredProducts, create);
router.get("/", verifyToken, autorizeAccess(["admin", "user"]), get);

export default router;
