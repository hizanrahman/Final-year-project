const express = require("express");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoStore = require("connect-mongo");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000", "http://localhost:5000"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(express.static("public"));

// Session setup
app.set("trust proxy", 1);
const isProduction = process.env.NODE_ENV === "production";
app.use(
  session({
    secret: process.env.SESSION_SECRET || "phishing-sim-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 24 * 60 * 60, // 1 day
      autoRemove: "native",
    }),
    cookie: {
      secure: isProduction, // true for HTTPS in production, false for local
      sameSite: isProduction ? "none" : "lax", // none for cross-site, lax for local
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
    },
  })
);

// Dummy user for demonstration
const DUMMY_USER = { username: "admin", password: "password123", name: "Admin User" };

// Auth endpoints
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (username === DUMMY_USER.username && password === DUMMY_USER.password) {
    req.session.user = { username: DUMMY_USER.username, name: DUMMY_USER.name };
    return res.json({ success: true, user: req.session.user });
  }
  res.status(401).json({ success: false, message: "Invalid credentials" });
});

app.get("/api/auth/user", (req, res) => {
  if (req.session.user) {
    return res.json({ user: req.session.user });
  }
  res.status(401).json({ user: null });
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

// Health check
app.get("/api/status", (req, res) => {
  res.json({ status: "Phishing-Sim API is running ✅" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
