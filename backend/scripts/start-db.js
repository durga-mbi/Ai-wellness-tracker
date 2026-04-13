import { spawn, execSync } from "child_process";
import net from "net";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, "../mongodb_data");
const LOG_PATH = path.resolve(__dirname, "../mongodb_log.log");
const PORT = 27018;

function isPortOpen(port) {
  return new Promise((resolve) => {
    const server = net.connect(port, "127.0.0.1", () => {
      server.end();
      resolve(true);
    });
    server.on("error", () => resolve(false));
  });
}

async function startDb() {
  console.log("🔍 Checking MongoDB Infrastructure...");
  
  const isOpen = await isPortOpen(PORT);
  if (isOpen) {
    console.log("✅ MongoDB Replica Set is already operational on port", PORT);
    process.exit(0);
  }

  console.log("🚀 Starting MongoDB Replica Set (rs0) on port", PORT, "...");
  
  const mongod = spawn("mongod", [
    "--port", PORT.toString(),
    "--dbpath", DB_PATH,
    "--replSet", "rs0",
    "--logpath", LOG_PATH,
    "--fork"
  ], { detached: true, stdio: "ignore" });

  mongod.unref();

  // Wait a moment for the fork to succeed
  setTimeout(async () => {
    if (await isPortOpen(PORT)) {
      console.log("✨ MongoDB Infrastructure Synchronized Successfully.");
      process.exit(0);
    } else {
      console.error("❌ Failed to start MongoDB. Check", LOG_PATH, "for details.");
      process.exit(1);
    }
  }, 3000);
}

startDb();
