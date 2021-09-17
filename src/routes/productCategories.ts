import { create, get } from "../controllers/productCategories";
import express from "express";
import verifyToken from "../middlewares/verify-token";
import autorizeAccess from "../middlewares/autorizeAccess";

const router = express.Router();

router.post("/", verifyToken, autorizeAccess(["admin"]), create);
router.get("/", verifyToken, autorizeAccess(["user", "admin", "anonymous"]), get);

export default router;
