import express from "express";
import verifyToken from "../middlewares/verify-token";
import autorizeAccess from "../middlewares/autorizeAccess";
import checkNumberOfEnteredProducts from "../middlewares/checkNumberOfEnteredProducts";
import { create, get, getByUserId, updateById } from "../controllers/product";
const router = express.Router();

router.post("/", verifyToken, autorizeAccess(["admin", "user"]), checkNumberOfEnteredProducts, create);
router.get("/", verifyToken, autorizeAccess(["admin", "user"]), get);
router.get("/user/:userId", verifyToken, autorizeAccess(["admin", "user"]), getByUserId);
router.put("/:id", verifyToken, autorizeAccess(["admin", "user"]), updateById);
export default router;
