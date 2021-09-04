import express from "express";
import verifyToken from "../middlewares/verify-token";
import autorizeAccess from "../middlewares/autorizeAccess";
import {
  updateFreeShoppingList,
  getShoppingList,
  toggleProductBoughtStatus,
  clearShoppingList,
  changeIsClearRequested,
} from "../controllers/shoppingList";

const router = express.Router();

router.post("/freeShoppingList", verifyToken, updateFreeShoppingList);
router.post("/", verifyToken, getShoppingList);
router.put("/toggleProductStatus", verifyToken, toggleProductBoughtStatus);
router.put("/changeClearStatus/:listId", verifyToken, changeIsClearRequested);
router.put("/clear/:listId", verifyToken, clearShoppingList);

export default router;
