const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const adSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  location: { type: String },
  images: { type: Array, required: true },
  contactDetails: { type: Object, required: true },
  negotiable: { type: Boolean, required: true },
  hideNumber: { type: Boolean, required: true },
  reviewed: { type: Boolean, required: true },
  created: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  active: { type: Boolean, required: true, default: false },
});

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Ad", adSchema);
