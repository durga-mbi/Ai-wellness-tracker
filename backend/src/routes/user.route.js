import express from "express";
import { savePreferences, getPreference, updateProfile } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/preferences", protect, savePreferences);
router.get("/my-preference", protect, getPreference);
router.put("/profile", protect, updateProfile);

export default router;