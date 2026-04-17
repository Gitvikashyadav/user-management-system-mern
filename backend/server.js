require("dotenv").config();
console.log("JWT:", process.env.JWT_ACCESS_SECRET);
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");

const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

const app = express();

/* ───────────────────────────────
   SAFE ERROR HANDLING (FIXED)
─────────────────────────────── */
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
});

/* ───────────────────────────────
   SAFE DB CONNECTION
─────────────────────────────── */
let isConnected = false;
const safeConnectDB = async () => {
  if (isConnected) return;
  await connectDB();
  isConnected = true;
};
safeConnectDB();

/* ───────────────────────────────
   SECURITY
─────────────────────────────── */
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests",
  },
});

app.use("/api", limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
});

app.use("/api/auth", authLimiter);

/* ───────────────────────────────
   MIDDLEWARE
─────────────────────────────── */
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://user-management-system-mern-frontend-fidn.onrender.com",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(xss());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/* ───────────────────────────────
   TEST ROUTES
─────────────────────────────── */
app.get("/", (req, res) => {
  res.json({ message: "API working 🚀" });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server running vikash",
  });
});

/* ───────────────────────────────
   ROUTES
─────────────────────────────── */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

/* ───────────────────────────────
   ERROR HANDLERS
─────────────────────────────── */
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
