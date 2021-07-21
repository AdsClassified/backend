const express = require("express");

const messagesController = require("../controllers/messages-controllers");

const router = express.Router();

router.post("/", messagesController.getMessages);
router.post("/add", messagesController.addMessages);
router.post("/disablenotify", messagesController.disableNotify);
// router.post("/edit", popupController.editPopup);

module.exports = router;
