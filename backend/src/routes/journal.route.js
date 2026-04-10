import express from "express";
import { createEntry, getEntries, getMoodSummary } from "../controllers/journal.controller.js";
import { getMoodHeatmap } from "../controllers/insight.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createEntry);
router.get("/", protect, getEntries);
router.get("/summary", protect, getMoodSummary);
router.get("/calendar", protect, getMoodHeatmap);

export default router;
