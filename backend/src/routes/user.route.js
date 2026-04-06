import express from "express";
import { savePreferences } from "../controllers/user.controller.js";
import { getPreference } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/preferences", protect, savePreferences);
router.get("/my-preference", protect, getPreference);

export default router;