import express from "express";
import { getTodayInsight } from "../controllers/dailyInsight.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/today", protect, getTodayInsight);

export default router;
