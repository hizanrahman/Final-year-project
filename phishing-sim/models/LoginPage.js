const mongoose = require("mongoose");

const LoginPageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    html: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("LoginPage", LoginPageSchema);
