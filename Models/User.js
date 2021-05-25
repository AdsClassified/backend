const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: Number, required: true, unique: true },
  emailVerified: { type: Boolean },
  phoneVerified: { type: Boolean },
  otp: { type: String, required: true },
  favourites: { type: Array },
  searchActivity: { type: Array },
});

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
