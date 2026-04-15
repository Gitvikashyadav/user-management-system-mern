require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");

const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

const app = express();

/* ─────────────────────────────
   DB CONNECTION (SAFE FOR VERCEL)
───────────────────────────── */
let isConnected = false;

const connectToDB = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

/* ─────────────────────────────
   GLOBAL MIDDLEWARE
───────────────────────────── */
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(xss());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/* ─────────────────────────────
   RATE LIMIT
───────────────────────────── */
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

/* ─────────────────────────────
   HEALTH ROUTE (IMPORTANT)
───────────────────────────── */
app.get("/health", async (req, res) => {
  try {
    await connectToDB();

    res.json({
      success: true,
      message: "API working fine 🚀",
      env: process.env.NODE_ENV,
      time: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

/* ─────────────────────────────
   ROUTES
───────────────────────────── */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

/* ─────────────────────────────
   ERROR HANDLING
───────────────────────────── */
app.use(notFound);
app.use(errorHandler);

/* ─────────────────────────────
   VERCEL EXPORT (IMPORTANT)
───────────────────────────── */
module.exports = app;