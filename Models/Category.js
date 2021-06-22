const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  title: { type: String, required: true },
  subcategories: { type: Array },
  icon: { type: String },
  image: { type: String, required: true },
});

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Category", categorySchema);
