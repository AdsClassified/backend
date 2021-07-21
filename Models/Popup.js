const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const popupSchema = new Schema({
  title: { type: String, required: true },
  link: { type: String },
  description: { type: String },
  image: { type: String },
});

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Popup", popupSchema);
