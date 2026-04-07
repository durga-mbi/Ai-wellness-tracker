import express from "express";
import { signup, login, logout, getMe, guestLogin } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/guest-login", guestLogin);
router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;