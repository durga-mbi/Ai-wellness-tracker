import express from "express";
import { getMoodHeatmap, getCorrelationInsights } from "../controllers/insight.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/mood-heatmap", getMoodHeatmap);
router.get("/correlations", getCorrelationInsights);

export default router;
