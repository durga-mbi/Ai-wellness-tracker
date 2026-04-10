import express from "express";
import { analyzeMessage, getUserCrises } from "../controllers/crisis.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// POST → analyze message for crisis
router.post("/analyze", protect, analyzeMessage);
router.get("/user/:userId", protect, getUserCrises);

export default router;