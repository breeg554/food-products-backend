import express from "express";
import verifyToken from "../middlewares/verify-token.js";
import autorizeAccess from "../middlewares/autorizeAccess.js";
import checkNumberOfEnteredProducts from "../middlewares/checkNumberOfEnteredProducts.js";
import { create, get, getByUserId, updateById } from "../controllers/product.js";
const router = express.Router();

router.post("/", verifyToken, autorizeAccess(["admin", "user"]), checkNumberOfEnteredProducts, create);
router.get("/", verifyToken, autorizeAccess(["admin", "user"]), get);
router.get("/user/:userId", verifyToken, autorizeAccess(["admin", "user"]), getByUserId);
router.put("/:id", verifyToken, autorizeAccess(["admin", "user"]), updateById);
export default router;
