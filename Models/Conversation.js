const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const conversationSchema = new Schema(
  {
    members: { type: Array },
    title: { type: String },
    image: { type: String },
    adType: { type: String },
    membersEmails: { type: Array },
    adId: { type: String },
    senderEmail: { type: String },
    senderPhone: { type: String },
  },
  { timestamps: true }
);

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Conversation", conversationSchema);
