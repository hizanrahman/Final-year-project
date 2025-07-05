const express = require("express");
const router = express.Router();
const LoginPage = require("../models/LoginPage");

// Simple authentication middleware (duplicated from server.js to avoid circular dependency)
const requireAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ error: "Authentication required" });
  }
};

// List all login pages
router.get("/", requireAuth, async (req, res) => {
  const pages = await LoginPage.find().sort({ createdAt: -1 });
  res.json(pages);
});

// Create
router.post("/", requireAuth, async (req, res) => {
  const { name, html } = req.body;
  const page = new LoginPage({ name, html });
  await page.save();
  res.status(201).json(page);
});

// Read one
router.get("/:id", requireAuth, async (req, res) => {
  const page = await LoginPage.findById(req.params.id);
  if (!page) return res.status(404).json({ error: "Not found" });
  res.json(page);
});

// Update
router.put("/:id", requireAuth, async (req, res) => {
  const { name, html } = req.body;
  const page = await LoginPage.findByIdAndUpdate(
    req.params.id,
    { name, html },
    { new: true },
  );
  if (!page) return res.status(404).json({ error: "Not found" });
  res.json(page);
});

// Delete
router.delete("/:id", requireAuth, async (req, res) => {
  await LoginPage.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
