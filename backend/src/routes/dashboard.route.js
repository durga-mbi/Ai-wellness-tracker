import express from "express";
import { getDashboardData } from "../controllers/dashboard.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// GET dashboard data for a user
router.get("/:userId", protect, getDashboardData);

export default router;