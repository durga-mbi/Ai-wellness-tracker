import express from "express";
import { getMoodSyncVideo } from "../controllers/mindfulness.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Synchronize with AI to find a mood-specific ritual video
router.post("/video-search", protect, getMoodSyncVideo);

export default router;
