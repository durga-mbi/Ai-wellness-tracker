import express from "express";
import { savePreferences, getPreference, updateProfile, getMoodSummary } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/preferences", protect, savePreferences);
router.get("/my-preference", protect, getPreference);
router.get("/mood-summary", protect, getMoodSummary);
router.put("/profile", protect, updateProfile);

export default router;