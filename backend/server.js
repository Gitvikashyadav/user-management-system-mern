require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");

const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

// ❌ OLD CODE (DO NOT USE IN VERCEL)
// const logger = require("./utils/logger");

const app = express();

/* ─────────────────────────────────────────────────────────────
   🚨 UNHANDLED ERROR HANDLER (FIXED FOR VERCEL)
   OLD: process.exit(1) was crashing serverless function
───────────────────────────────────────────────────────────── */
process.on("unhandledRejection", (err) => {
  // ❌ OLD: logger.error(...)
  console.error("Unhandled Rejection:", err.message);

  // ❌ OLD: process.exit(1); (REMOVED for Vercel)
});

/* ─────────────────────────────────────────────────────────────
   🚨 DATABASE CONNECTION
   OLD: connectDB(); directly at top (can crash Vercel)
───────────────────────────────────────────────────────────── */
connectDB();

/* ─────────────────────────────────────────────────────────────
   SECURITY MIDDLEWARE
───────────────────────────────────────────────────────────── */
app.use(helmet());

/* ─────────────────────────────────────────────────────────────
   RATE LIMITING
───────────────────────────────────────────────────────────── */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

app.use("/api", limiter);

/* Auth specific limiter */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Too many login attempts, please try again later.",
  },
});

app.use("/api/auth", authLimiter);

/* ─────────────────────────────────────────────────────────────
   CORS CONFIG
───────────────────────────────────────────────────────────── */
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ─────────────────────────────────────────────────────────────
   BODY PARSING
───────────────────────────────────────────────────────────── */
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

/* ─────────────────────────────────────────────────────────────
   SECURITY AGAINST XSS
───────────────────────────────────────────────────────────── */
app.use(xss());

/* ─────────────────────────────────────────────────────────────
   LOGGING (ONLY DEV)
   OLD: morgan("dev") always used
───────────────────────────────────────────────────────────── */
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/* ─────────────────────────────────────────────────────────────
   🚀 TEST ROUTES (IMPORTANT FOR VERCEL DEBUG)
───────────────────────────────────────────────────────────── */

// OLD: no "/" route → caused 404 confusion
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API is running successfully 🚀",
  });
});

/* Health check route */
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

/* ─────────────────────────────────────────────────────────────
   API ROUTES
───────────────────────────────────────────────────────────── */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

/* ─────────────────────────────────────────────────────────────
   ERROR HANDLERS
───────────────────────────────────────────────────────────── */
app.use(notFound);
app.use(errorHandler);

/* ─────────────────────────────────────────────────────────────
   🚨 SERVER START (IMPORTANT FIX)
   OLD (REMOVED FOR VERCEL):
   const PORT = process.env.PORT || 5000;
   app.listen(PORT)

   NEW: DO NOTHING (Vercel handles it)
───────────────────────────────────────────────────────────── */

/*
OLD CODE (DO NOT USE IN VERCEL):

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
*/

module.exports = app;