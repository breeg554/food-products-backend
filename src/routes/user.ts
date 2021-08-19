import express from "express";
import verifyToken from "../middlewares/verify-token";
import autorizeAccess from "../middlewares/autorizeAccess";
import {
  token,
  logout,
  signUp,
  signIn,
  getUserDetails,
  getAll,
  signInAnonymous,
  updateUserDetails,
  checkIfUsernameIsTaken,
  getUserStats,
} from "../controllers/user";
const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signin/anonymous", signInAnonymous);
router.post("/token", token);
router.post("/logout", logout);
router.post("/username", checkIfUsernameIsTaken);
router.get("/user", verifyToken, getUserDetails);
router.get("/user/:id/statistic", verifyToken, getUserStats);
// router.get("/users/all", verifyToken, autorizeAccess(["admin"]), getAll);
router.put("/user", verifyToken, updateUserDetails);

export default router;
