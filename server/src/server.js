import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import storiesRouter from "./routes/storiesroutes.js";
import authRouter from "./routes/authRoutes.js";
import destinationsRouter from "./routes/destinationsRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded images
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Rehla API is running" });
});

app.use("/api/auth", authRouter);
app.use("/api/stories", storiesRouter);
app.use("/api/destinations", destinationsRouter);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("Missing MONGO_URI in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`✅ Server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server failed to start:", err.message);
    process.exit(1);
  }
}

start();
