import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { errorHandler } from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.route.js";
import chatbotRoutes from "./routes/chatbot.route.js";
import journalRoutes from "./routes/journal.route.js";
import userRoutes from "./routes/user.route.js"; // keep this

const app = express();

app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(cookieParser());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/chat", chatbotRoutes);
app.use("/api/user", userRoutes); // keep this

// Health route
app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use(errorHandler);

export default app;