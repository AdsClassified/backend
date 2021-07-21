const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const messagesSchema = new Schema(
  {
    conversationId: { type: String, required: true },
    sender: { type: String, required: true },
    messages: { type: Array },
  },
  { timestamps: true }
);

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Messages", messagesSchema);
