import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);
import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import compilerRoutes from "./routes/compiler.routes";
import problemRoutes from "./routes/problem.routes";
import submissionRoutes from "./routes/submission.routes";
import statsRoutes from "./routes/stats.routes";
import bookmarkRoutes from "./routes/bookmark.routes";
import articleRoutes from "./routes/article.routes";
import aiRoutes from "./routes/ai.routes";
import passport from "./config/passport";
import leaderboardRoutes from "./routes/leaderboard.routes";
import { errorHandler } from "./middleware/errorHandler.middleware";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/compiler", compilerRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "CompileX backend is running" });
});
app.use(errorHandler);
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});