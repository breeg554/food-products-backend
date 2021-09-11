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

router.post("/", verifyToken, getShoppingList);
router.post("/updateShoppingList", verifyToken, updateShoppingList);
router.post("/generateFromMealPlan", verifyToken, generateListFromMealPlan);
router.put("/toggleProductStatus", verifyToken, toggleProductBoughtStatus);
router.put("/changeClearStatus/:listId", verifyToken, changeIsClearRequested);
router.put("/clear/:listId", verifyToken, clearShoppingList);

export default router;
