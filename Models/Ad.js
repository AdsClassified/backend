const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const adSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  categoryName: { type: String, required: true },
  subCategory: { type: String, required: true },
  subCategoryName: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  location: { type: Object },
  images: { type: Array, required: true },
  contactDetails: { type: Object, required: true },
  negotiable: { type: Boolean, required: true },
  hideNumber: { type: Boolean, required: true },

  created: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  active: { type: Boolean, default: false },
  approved: { type: Boolean, default: false },
  rejected: { type: Boolean, default: false },
  reviewed: { type: Boolean, default: false },
  sold: { type: Boolean, default: false },
  featureAd: { type: Boolean, default: false },
  featureAdRequest: { type: Boolean, default: false },
  featureAdReviewed: { type: Boolean, default: false },
});

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Ad", adSchema);
