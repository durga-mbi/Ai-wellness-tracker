import { createServer } from "http";
import app from "./app.js";
import dotenv from "dotenv";
import { initSocket } from "./socket.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const httpServer = createServer(app);

// Initialize Socket.io
initSocket(httpServer);

app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});