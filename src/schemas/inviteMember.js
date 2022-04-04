const mongoose = require("mongoose");

module.exports = mongoose.model("raings_invite", new mongoose.Schema({
  guildID: { type: String, default: "" },
  userID: { type: String, default: "" },
  inviter: { type: String, default: "" },
  date: { type: Number, default: Date },
}));
