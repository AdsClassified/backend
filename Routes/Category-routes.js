const express = require("express");

const categoryController = require("../controllers/category-controllers");

const router = express.Router();

router.get("/", categoryController.getCategories);
router.post("/add", categoryController.addCategories);
router.post("/delete", categoryController.deleteCategories);
router.post("/edit", categoryController.editCategories);

module.exports = router;
