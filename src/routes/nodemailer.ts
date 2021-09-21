import { sendShoppingList, sendRecipe } from "../controllers/nodemailer";
import express from "express";
import multer from "multer";
import verifyToken from "../middlewares/verify-token";
import autorizeAccess from "../middlewares/autorizeAccess";
const processMultipart = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post(
  "/shoppingList",
  verifyToken,
  autorizeAccess(["user", "admin"]),
  processMultipart.single("pdf"),
  sendShoppingList
);
router.post("/recipe", verifyToken, autorizeAccess(["user", "admin"]), processMultipart.single("pdf"), sendRecipe);
export default router;
