import express from "express";
import { getSystemConfig, updateSystemConfig } from "../controllers/system.controller.js";

const router = express.Router();

router.get("/config", getSystemConfig);
router.post("/config", updateSystemConfig);

export default router;
