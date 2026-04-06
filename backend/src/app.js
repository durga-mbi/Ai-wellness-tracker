
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(cookieParser());

//api
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes)

// Health route(check for dummy server response)
app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});



app.use(errorHandler);

export default app;