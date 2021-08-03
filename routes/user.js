import express from "express";
import verifyToken from "../verify-token.js";
import autorizeAccess from "../autorizeAccess.js";
import {
  token,
  logout,
  signUp,
  signIn,
  getUserDetails,
  getAll,
  signInAnonymous,
} from "../controllers/user.js";
const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signin/anonymous", signInAnonymous);
router.post("/token", token);
router.post("/logout", logout);
router.get("/user", verifyToken, getUserDetails);
router.get("/users/all", verifyToken, autorizeAccess(["admin"]), getAll);

export default router;
