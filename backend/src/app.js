import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { errorHandler } from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.route.js";
import chatbotRoutes from "./routes/chatbot.route.js";
import journalRoutes from "./routes/journal.route.js";
import userRoutes from "./routes/user.route.js"; // keep this
import userHabitsRoute from "./routes/userhabits.route.js";
import dashboardRoute from "./routes/dashboard.route.js";
import forumRoutes from "./routes/forum.route.js";
import crisisRoutes from "./routes/crisis.route.js";
import mindfulnessRoutes from "./routes/mindfulness.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import aiRoutes from "./routes/ai.routes.js";
import dailyInsightRoutes from "./routes/dailyInsight.routes.js";
import systemRoutes from "./routes/system.route.js";

const app = express();

app.set("trust proxy", 1); // Trust the first proxy (Render/Vercel)

app.use(express.json());

const ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://ai-wellness-tracker-pi.vercel.app"
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow all origins
        callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With", "Accept"],
    exposedHeaders: ["Set-Cookie"]
}));

app.use(cookieParser());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/chat", chatbotRoutes);
app.use("/api/user", userRoutes); // keep this
app.use("/api/habits", userHabitsRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/forum", forumRoutes);
app.use("/api/crisis", crisisRoutes);
app.use("/api/mindfulness", mindfulnessRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/daily-insight", dailyInsightRoutes);
app.use("/api/system", systemRoutes);

app.get("/api/debug-routes", (req, res) => {
    res.json({ message: "debug route is live", time: new Date().toISOString() });
});

// Health route (High-Availability Alias)
app.get("/health", (req, res) => {
    res.json({ status: "ok", mode: "Verifying latest build" });
});

app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: "api" });
});

app.use(errorHandler);

export default app;