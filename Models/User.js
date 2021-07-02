const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: Number, required: true, unique: true },
  emailVerified: { type: Boolean },
  phoneVerified: { type: Boolean },
  otpEmail: { type: String, required: true },
  otpPhone: { type: String, required: true },
  favourites: { type: Array },
  searchActivity: { type: Array },
  messages: { type: Array },
  profileImage: { type: String },
  block: { type: Boolean, default: false },
  location: { type: Object },
});

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
