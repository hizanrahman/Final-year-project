const express = require("express");
const router = express.Router();
const EmailTemplate = require("../models/EmailTemplate");

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ error: "Authentication required" });
  }
};

// Create a new template
router.post("/", requireAuth, async (req, res) => {
  try {
    const { name, subject, content } = req.body;
    const template = new EmailTemplate({ name, subject, content });
    await template.save();
    res.status(201).json(template);
  } catch (err) {
    res.status(500).json({ error: "Failed to save template" });
  }
});

// Get all templates
router.get("/", requireAuth, async (req, res) => {
  try {
    const templates = await EmailTemplate.find().sort({ createdAt: -1 });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch templates" });
  }
});

// Get one template by ID
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);
    if (!template) return res.status(404).json({ error: "Template not found" });
    res.json(template);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch template" });
  }
});

// Delete templates by IDs
router.post("/delete", requireAuth, async (req, res) => {
  try {
    const { ids } = req.body; // expecting array of template IDs
    await EmailTemplate.deleteMany({ _id: { $in: ids } });
    res.json({ message: "Templates deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete templates" });
  }
});

module.exports = router;
