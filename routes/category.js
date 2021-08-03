import { create, get } from "../controllers/category.js";
import express from "express";
import verifyToken from "../verify-token.js";
import autorizeAccess from "../autorizeAccess.js";

const router = express.Router();

router.post("/", verifyToken, autorizeAccess(["admin"]), create);
router.get("/", verifyToken, autorizeAccess(["user", "admin"]), get);

export default router;
