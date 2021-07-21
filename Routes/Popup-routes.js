const express = require("express");

const popupController = require("../controllers/popup-controllers");

const router = express.Router();

router.get("/", popupController.getPopup);
router.post("/add", popupController.addPopup);
router.post("/delete", popupController.deletePopup);
router.post("/edit", popupController.editPopup);

module.exports = router;
