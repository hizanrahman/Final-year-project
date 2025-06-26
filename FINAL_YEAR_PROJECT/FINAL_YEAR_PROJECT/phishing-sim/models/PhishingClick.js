const mongoose = require("mongoose");

const phishingClickSchema = new mongoose.Schema({
  email: String,
  ipAddress: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PhishingClick", phishingClickSchema);
