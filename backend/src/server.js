import { createServer } from "http";
import app from "./app.js";
import dotenv from "dotenv";
import { initSocket } from "./socket.js";
import cron from "node-cron";
import { generateGlobalInsights } from "./controllers/dailyInsight.controller.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const httpServer = createServer(app);

// Initialize Socket.io
initSocket(httpServer);

// 🌅 Schedule Daily AI Insight at 6:00 AM
cron.schedule("0 6 * * *", () => {
    generateGlobalInsights();
});

// For testing purposes, you can trigger this once on startup if needed:
// generateGlobalInsights();

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});