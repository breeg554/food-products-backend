import express from "express";
import verifyToken from "../middlewares/verify-token";
import autorizeAccess from "../middlewares/autorizeAccess";
import {
  updateShoppingList,
  getShoppingList,
  toggleProductBoughtStatus,
  clearShoppingList,
  changeIsClearRequested,
  generateListFromMealPlan,
} from "../controllers/shoppingList";

const router = express.Router();

router.post("/", verifyToken, autorizeAccess(["user", "admin"]), getShoppingList);
router.post("/updateShoppingList", verifyToken, autorizeAccess(["user", "admin"]), updateShoppingList);
router.post("/generateFromMealPlan", verifyToken, autorizeAccess(["user", "admin"]), generateListFromMealPlan);
router.put("/toggleProductStatus", verifyToken, autorizeAccess(["user", "admin"]), toggleProductBoughtStatus);
router.put("/changeClearStatus/:listId", verifyToken, autorizeAccess(["user", "admin"]), changeIsClearRequested);
router.put("/clear/:listId", verifyToken, autorizeAccess(["user", "admin"]), clearShoppingList);

export default router;
